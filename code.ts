const RESULT_NUM = 100
const CLASS_LIST = ["filledButton", "outlinedButton"]

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

const addComponent = async (frame: FrameNode, classList: string[], darkMode: boolean = true) => {
  const className = classList[Math.floor(Math.random() * classList.length)]
  const fromLabeled = Math.random() < 0.5 ? true : false

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

  if (
    !fromLabeled &&
    darkMode
  ) {
    componentSection = componentSection.findChild((section) => section.type === "SECTION" && section.name === "darkMode")
  }

  if (
    !componentSection ||
    componentSection.type !== "SECTION"
  ) {
    figma.closePlugin("Component section not found")
    return
  }

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
    newComponent.type === "INSTANCE" ||
    newComponent.type === "COMPONENT" ||
    newComponent.type === "FRAME" ||
    newComponent.type === "GROUP"
  ) {
    const textNodes = newComponent.findAll((node) => node.type === "TEXT")
    for (const text of textNodes) {
      if (text.type !== "TEXT" || text.fills === figma.mixed || text.hasMissingFont) return

      await Promise.all(
        text.getRangeAllFontNames(0, text.characters.length)
          .map(figma.loadFontAsync)
      )

      text.characters = generateRandomString(text.characters.length)
      // console.log(text.characters);

      const a = text.fills[0].opacity ? text.fills[0].opacity : 1
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
  if (className === "outlinedButton") {
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
        if (rect && rect.type === "RECTANGLE") {
          const a = rect.strokes[0].opacity ? rect.strokes[0].opacity : 1
          const color = darkMode ?
            hsl(Math.random() * 360, Math.random() * 100, Math.random() * 80, a * 100) :
            hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 75, a * 100)
          rect.strokes = [figma.util.solidPaint(color)]
        }
      }
    }
  } else if (className === "filledButton") {
    // Change the color for filled button
    if (
      "fills" in newComponent &&
      newComponent.fills !== figma.mixed &&
      newComponent.fills.length
    ) {
      // If the component has fills
      const a = newComponent.fills[0].opacity ? newComponent.fills[0].opacity : 1
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

        const a = node.fills[0].opacity ? node.fills[0].opacity : 1
        const color = darkMode ?
          hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 75, a * 100) :
          hsl(Math.random() * 360, Math.random() * 100, Math.random() * 80, a * 100)
        node.fills = [figma.util.solidPaint(color)]
      })
    }
  }
}

const addComponents = async (frame: FrameNode, classList: string[], darkMode: boolean = true) => {
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
  for (let i = 0; i < RESULT_NUM; i++) {
    const newFrame = figma.createFrame()
    newFrame.x = frameX
    newFrame.y = frameY
    newFrame.resize(390, 844)
    newFrame.name = `Frame ${i + 1}`

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

    frameX += 410
    if (frameX >= 4100) {
      frameX = 0
      frameY += 864
    }
  }

  figma.closePlugin()
}

main()