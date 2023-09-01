figma.skipInvisibleInstanceChildren = true;

const RESULT_NUM = 1000
const CLASS_LIST: string[] = ["filledButton", "outlinedButton"]
const FRAME_SIZE: { [key: string]: number[] } = {
  "iPhone 14 Plus": [428, 926],
  "iPhone 14 Pro Max": [430, 932],
  "iPhone 14 Pro": [393, 852],
  "iPhone 14": [390, 844],
  "iPhone 13 Pro Max": [428, 926],
  "iPhone 13 Pro": [390, 844],
  "iPhone 13": [390, 844],
  "iPhone 13 mini": [375, 812],
  "iPhone SE": [320, 568],
  "iPhone 8 Plus": [414, 736],
  "iPhone 8": [375, 667],
  "Android Small": [360, 640],
  "Android Large": [360, 800]
}

const CLASSES_PROBOBILITY: { [key: string]: number } = {
  statusBar: 0.5,
  homeIndicator: 0.5,
  TextButton: 0,
  badge: 0,
  keyboard: 0,
  text: 0,
  imageRectangle: 0,
  imageEllipse: 0,
  rectangle: 0,
  ellipse: 0,
  textField: 0,
  searchField: 0,
  filledButton: 0,
  outlinedButton: 0,
  iconButton: 0,
  filledIconButton: 0,
  outlinedIconButton: 0,
  icon: 0,
  segmentedButton: 0,
  switch: 0,
  topAppBar: 0,
  chip: 0,
  list: 0,
  row: 0,
  card: 0,
  carousel: 0,
  grid: 0,
  tabBar: 0,
  tab: 0,
  bottomNavigation: 0,
  backDrop: 0,
  banner: 0,
  modal: 0,
  tooltip: 0,
  radioButton: 0,
  datePicker: 0,
  timePicker: 0,
  quantityPicker: 0,
  bottomAppBar: 0,
  other: 0,
}

const generateRandomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const hsl = (h: number, s: number, l: number, a: number = 100) => `hsl(${h} ${s}% ${l}% / ${a}%)`

// const getColor = (darkMode: boolean, a: number, frame: FrameNode) => {
//   const color = darkMode ?
//   hsl(Math.random() * 360, Math.random() * 100, Math.random() * 80, a * 100) :
//   hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 75, a * 100)

// }

const addComponent = async (frame: FrameNode, classList: string[], darkMode: boolean = false) => {
  const className = classList[Math.floor(Math.random() * classList.length)]
  // const fromLabeled = Math.random() < 0.5 ? true : false
  const fromLabeled = false

  // Is there a page named "Synthetic Pallete"?
  let syntheticPallete = figma.root.findChild(page => page.name === "Synthetic Pallete")

  if (!syntheticPallete) {
    figma.closePlugin("Synthetic Pallete page not found")
    return
  }

  // Is there a component section?
  let componentSection = fromLabeled ?
    syntheticPallete.findChild((node) => node.type === "SECTION" && node.name.startsWith(`${className} from labeled data`)) :
    syntheticPallete.findChild((node) => node.type === "SECTION" && node.name === className)

  if (
    !componentSection ||
    componentSection.type !== "SECTION"
  ) {
    figma.closePlugin("Component section not found")
    return
  }

  // // From Dark Mode?
  // if (
  //   !fromLabeled &&
  //   darkMode
  // ) {
  //   componentSection = componentSection.findChild((section) => section.type === "SECTION" && section.name === "darkMode")
  // }

  // if (
  //   !componentSection ||
  //   componentSection.type !== "SECTION"
  // ) {
  //   figma.closePlugin("Component section not found")
  //   return
  // }

  // Get a component
  const componentRandomNumber = Math.floor(Math.random() * componentSection.children.length)
  let component = componentSection.children[componentRandomNumber]
  if (component.type === "SECTION") {
    component = componentSection.children[componentRandomNumber + 1]
  }

  const newComponent = component.clone()

  // Put the component in the frame
  frame.appendChild(newComponent)
  newComponent.name = className

  // Change the text
  if (
    Math.random() < 0.9 &&
    newComponent.type === "INSTANCE" ||
    newComponent.type === "COMPONENT" ||
    newComponent.type === "FRAME" ||
    newComponent.type === "GROUP"
  ) {
    const textNodes = newComponent.findAll((node) => node.type === "TEXT")
    for (const text of textNodes) {
      if (
        text.type !== "TEXT" ||
        text.hasMissingFont ||
        text.fills === figma.mixed ||
        !text.fills.length
      ) continue

      await Promise.all(
        text.getRangeAllFontNames(0, text.characters.length)
          .map(figma.loadFontAsync)
      )

      text.characters = generateRandomString(text.characters.length)

      const a = text.fills[0].opacity ? text.fills[0].opacity : 1
      // const a = 1
      const color = darkMode ?
        hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 75, a * 100) :
        hsl(Math.random() * 360, Math.random() * 100, Math.random() * 80, a * 100)
      text.fills = [figma.util.solidPaint(color)]
    }
  }

  // Set the location
  newComponent.x = Math.random() * (frame.width - newComponent.width)
  newComponent.y = Math.random() * (frame.height - newComponent.height)

  // Change the color for outlined button
  if (
    Math.random() < 0.9 &&
    className === "outlinedButton"
  ) {
    if (
      "strokes" in newComponent &&
      newComponent.strokes.length
    ) {
      // If the component has strokes
      const a = newComponent.strokes[0].opacity ? newComponent.strokes[0].opacity : 1
      const color = darkMode ?
        hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 75, a * 100) :
        hsl(Math.random() * 360, Math.random() * 100, Math.random() * 80, a * 100)

      newComponent.strokes = [figma.util.solidPaint(color)]
    } else {
      // If the component doesn't have strokes
      if (newComponent.type === "GROUP") {
        const rect = newComponent.findOne((node) => node.type === "RECTANGLE")
        if (
          rect &&
          rect.type === "RECTANGLE" &&
          "strokes" in rect &&
          rect.strokes.length
        ) {
          const a = rect.strokes[0].opacity ? rect.strokes[0].opacity : 1
          const color = darkMode ?
            hsl(Math.random() * 360, Math.random() * 100, Math.random() * 80, a * 100) :
            hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 75, a * 100)
          rect.strokes = [figma.util.solidPaint(color)]
        }
      }
    }
  } else if (
    Math.random() < 0.9 &&
    className === "filledButton"
  ) {
    // Change the color for filled button
    if (
      "strokes" in newComponent &&
      newComponent.strokes.length
    ) {
      // If the component has strokes
      const a = newComponent.strokes[0].opacity ? newComponent.strokes[0].opacity : 1
      const color = darkMode ?
        hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 75, a * 100) :
        hsl(Math.random() * 360, Math.random() * 100, Math.random() * 80, a * 100)

      newComponent.strokes = [figma.util.solidPaint(color)]
    }

    if (
      "fills" in newComponent &&
      newComponent.fills !== figma.mixed &&
      newComponent.fills.length
    ) {
      // If the component has fills
      const a = newComponent.fills[0].opacity ? newComponent.fills[0].opacity : 1
      // const a = 1
      const color = darkMode ?
        hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 75, a * 100) :
        hsl(Math.random() * 360, Math.random() * 100, Math.random() * 80, a * 100)
      newComponent.fills = [figma.util.solidPaint(color)]
    } else if (
      newComponent.type === "FRAME" ||
      newComponent.type === "COMPONENT" ||
      newComponent.type === "INSTANCE" ||
      newComponent.type === "GROUP"
    ) {
      // If the component doesn't have fills
      newComponent.findAll((node) => (
        node.type === "RECTANGLE" ||
        node.type === "ELLIPSE" ||
        node.type === "FRAME" ||
        node.type === "COMPONENT" ||
        node.type === "INSTANCE"
      )).forEach((node) => {
        if (
          !("fills" in node) ||
          node.fills === figma.mixed ||
          !node.fills.length
        ) return
        console.log(node.name)
        const a = node.fills[0].opacity ? node.fills[0].opacity : 1
        // const a = 1
        const color = darkMode ?
          hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 75, a * 100) :
          hsl(Math.random() * 360, Math.random() * 100, Math.random() * 80, a * 100)
        node.fills = [figma.util.solidPaint(color)]
      })
    }
  }
}

// const addStatusBar = async (frame: FrameNode, classList: string[], darkMode: boolean = false) => {
//   const statusBar = 
// }

// const addHomeIndicator = async (frame: FrameNode, classList: string[], darkMode: boolean = false) => {}

const addComponents = async (frame: FrameNode, classList: string[], darkMode: boolean = false) => {
  // if (Math.random() < CLASSES_PROBOBILITY["homeIndicator"]) {
  //   await addStatusBar(frame, classList, darkMode)
  //   await addHomeIndicator(frame, classList, darkMode)
  // }


  const splitFrameRandomNumber = Math.random()
  if (splitFrameRandomNumber <= 0.25) {
    await addComponent(frame, classList, darkMode)
  } else if (splitFrameRandomNumber <= 0.5) {
    for (let i = 1; i <= 2; i++) {
      const splitedFrame = figma.createFrame();
      frame.appendChild(splitedFrame);
      splitedFrame.fills = [];
      splitedFrame.resize(frame.width, frame.height / 2);
      splitedFrame.x = 0;
      splitedFrame.y = frame.height / 2 * (i - 1);
      splitedFrame.name = `Frame ${i}`;
      await addComponent(splitedFrame, classList, darkMode);
    }
  } else if (splitFrameRandomNumber <= 0.75) {
    for (let i = 1; i <= 3; i++) {
      const splitedFrame = figma.createFrame();
      frame.appendChild(splitedFrame);
      splitedFrame.fills = [];
      splitedFrame.resize(frame.width, frame.height / 3);
      splitedFrame.x = 0;
      splitedFrame.y = frame.height / 3 * (i - 1);
      splitedFrame.name = `Frame ${i}`;
      await addComponent(splitedFrame, classList, darkMode);
    }
  } else {
    for (let i = 1; i <= 4; i++) {
      const splitedFrame = figma.createFrame();
      frame.appendChild(splitedFrame);
      splitedFrame.fills = [];
      splitedFrame.resize(frame.width, frame.height / 4);
      splitedFrame.x = 0;
      splitedFrame.y = frame.height / 4 * (i - 1);
      splitedFrame.name = `Frame ${i}`;
      await addComponent(splitedFrame, classList, darkMode);
    }
  }
}

async function main() {
  let syntheticLab = figma.root.findChild(page => page.name === "Synthesis Lab")

  if (!syntheticLab) {
    const newPage = figma.createPage()
    newPage.name = "Synthesis Lab"
    figma.currentPage = newPage
  } else {
    figma.currentPage = syntheticLab
  }

  let frameX = 0
  let frameY = 0
  let maxFrameY = 0
  for (let i = 0; i < RESULT_NUM; i++) {
    const newFrame = figma.createFrame()
    newFrame.x = frameX
    newFrame.y = frameY

    const randomFrameSize = JSON.parse(JSON.stringify(
      FRAME_SIZE[Object.keys(FRAME_SIZE)[Math.floor(Math.random() * Object.keys(FRAME_SIZE).length)]]
    ))
    console.log("1.", randomFrameSize);

    if (Math.random() < 0.1) {
      randomFrameSize[1] = randomFrameSize[1] * 2
    } else if (Math.random() < 0.05) {
      randomFrameSize[1] = randomFrameSize[1] * 3
    }
    console.log("2.", randomFrameSize);
    newFrame.resize(randomFrameSize[0], randomFrameSize[1])
    newFrame.name = `Frame ${i + 1}`
    console.log("3.", newFrame.width, newFrame.height);

    if (frameY + newFrame.height > maxFrameY) {
      maxFrameY = frameY + newFrame.height
    }

    frameX += newFrame.width + 10
    if ((i + 1) % 50 === 0) {
      frameX = 0
      frameY = maxFrameY + 10
    }

    const frameColorRandomNumber = Math.random()
    if (frameColorRandomNumber <= 0.6) {
      newFrame.fills = [figma.util.solidPaint("#FFFFFF")]
      await addComponents(newFrame, CLASS_LIST)
    } else if (frameColorRandomNumber <= 0.8) {
      newFrame.fills = [figma.util.solidPaint("#222222")]
      await addComponents(newFrame, CLASS_LIST, true)
    } else {
      newFrame.fills = [figma.util.solidPaint(hsl(Math.random() * 360, 100, 97))]
      await addComponents(newFrame, CLASS_LIST)
    }
  }

  figma.closePlugin("Done🥰")
}

main()