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
  statusBar: 1,
  homeIndicator: 1,
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

const FONT_LIST: { [key: string]: string[] } = {
  "Abel": ["Regular"],
  "Abolition Test": ["Lines", "Regular", "Rough", "Round", "Soft", "Lines Oblique", "Oblique", "Rough Oblique", "Round Oblique", "Soft Oblique"],
  "Apple SD Gothic Neo": ["Bold", "ExtraBold", "Heavy", "Light", "Medium", "Regular", "SemiBold", "Thin"],
  "Calibri": ["Bold", "Bold Italic", "Italic", "Regular"],
  "Cascadia Code": ["Regular"],
  "Charlie Display": ["Regular", "Italic", "Thin", "Thin Italic", "Light", "Light Italic", "Semibold", "Semibold Italic", "Bold", "Bold Italic", "Black", "Black Italic"],
  "GitLab Mono": ["Regular", "Thin", "Thin Italic", "ExtraLight", "ExtraLight Italic", "Light", "Light Italic", "Medium", "Medium Italic", "SemiBold", "SemiBold Italic", "Bold", "Bold Italic", "ExtraBold", "ExtraBold Italic"],
  "GitLab Sans": ["Regular", "Thin", "Thin Italic", "ExtraLight", "ExtraLight Italic", "Medium", "Medium Italic", "SemiBold", "SemiBold Italic", "Bold", "Bold Italic", "ExtraBold", "ExtraBold Italic", "Black", "Black Italic"],
  "NanumSquare Neo variable": ["Regular", "Bold", "ExtraBold", "Heavy"],
  "Pretendard": ["Regular", "Thin", "ExtraLight", "Light", "Medium", "Bold", "Black"],
  "Product Sans": ["Regular", "Italic", "Bold", "Bold Italic"],
  "Proxima Nova": ["Regular", "Regular Italic", "Thin", "Thin Italic", "Light", "Light Italic", "Semibold", "Semibold Italic", "Bold", "Bold Italic", "Black", "Black Italic"],
  "Roboto": ["Black", "Black Italic", "Bold", "Bold Italic", "Italic", "Light", "Light Italic", "Medium", "Medium Italic", "Regular", "Thin", "Thin Italic"],
  "Sanomat Sans Trial": ["Regular", "Regular Italic", "Hairline", "Hairline Italic", "Thin", "Thin Italic", "XLight", "XLight Italic", "Medium", "Medium Italic", "Bold", "Bold Italic", "XBold", "XBold Italic", "Black", "Stencil Black", "Black Italic", "Stencil Black Italic"],
  "Segoe UI": ["Black", "Black Italic", "Bold", "Bold Italic", "Italic", "Light", "Light Italic", "Regular", "Semibold", "Semibold Italic", "Semilight", "Semilight Italic"],
  "SF Compact": ["Black", "Black Italic", "Bold", "Bold Italic", "Heavy", "Heavy Italic", "Light", "Light Italic", "Medium", "Medium Italic", "Regular", "Regular Italic", "Semibold", "Semibold Italic", "Thin", "Thin Italic", "Ultralight", "Ultralight Italic"],
  "SF Mono": ["Bold", "Bold Italic", "Heavy", "Heavy Italic", "Light", "Light Italic", "Medium", "Medium Italic", "Regular", "Regular Italic", "Semibold", "Semibold Italic"],
  "SF Pro": ["Black", "Black Italic", "Bold", "Bold Italic", "Heavy", "Heavy Italic", "Light", "Light Italic", "Medium", "Medium Italic", "Regular", "Regular Italic", "Semibold", "Semibold Italic", "Thin", "Thin Italic", "Ultralight", "Ultralight Italic", "Expanded Regular", "Expanded Thin", "Expanded Light", "Expanded Medium", "Expanded Bold", "Expanded Heavy", "Expanded Black", "Condensed Regular", "Condensed Thin", "Condensed Light", "Condensed Medium", "Condensed Bold", "Condensed Heavy", "Condensed Black", "Compressed Regular", "Compressed Thin", "Compressed Light", "Compressed Medium", "Compressed Bold", "Compressed Heavy", "Compressed Black"],
  "SF UI Text": ["Bold", "Bold Italic", "Heavy", "Heavy Italic", "Light", "Light Italic", "Medium", "Medium Italic", "Regular", "Italic", "Semibold", "Semibold Italic"],
  "Sofia Pro": ["Black"],
  "Spoqa Han Sans Neo": ["Regular", "Bold", "Light", "Medium"],
  "TT Norms": ["Black", "Black Italic", "Bold", "Bold Italic", "ExtraBold", "ExtraBold Italic", "ExtraLight", "ExtraLight Italic", "Light", "Light Italic", "Medium", "Medium Italic", "Regular", "Italic", "Thin", "Thin Italic"],
  "Uber Move": ["Regular", "Light", "Medium", "Bold"],
}

// Load all fonts in advance
const loadFonts = async () => {
  const promises = []
  for (const fontFamily of Object.keys(FONT_LIST)) {
    for (const fontStyle of FONT_LIST[fontFamily]) {
      promises.push(figma.loadFontAsync({ family: fontFamily, style: fontStyle }))
    }
  }

  return Promise.all(promises)
}

const generateRandomString = (length: number) => {
  let result = ''
  const characters = 'ABCDEFGHI JKLMNOPQRSTU VWXYZabcd efghijklmnopqrstu vwxyz 0123456789'
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result.trim()
}

const RGBToHSL = (color: { r: number, g: number, b: number }) => {
  let { r, g, b } = color
  const l = Math.max(r, g, b)
  const s = l - Math.min(r, g, b)
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
    : 0
  return {
    h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
    s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    l: (100 * (2 * l - s)) / 2,
  }
}

const hsl = (h: number, s: number, l: number, a: number = 100) => `hsl(${h} ${s}% ${l}% / ${a}%)`

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
        !text.fills.length ||
        text.fills[0].visible === false
      ) continue

      await Promise.all(
        text.getRangeAllFontNames(0, text.characters.length)
          .map(figma.loadFontAsync)
      )

      text.characters = generateRandomString(text.characters.length)

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
      newComponent.fills.length &&
      newComponent.fills[0].visible === true
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
          !node.fills.length ||
          node.fills[0].visible === false
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

const getComponent = (className: string, fromLabeledProbability: number = 0) => {
  const fromLabeled = Math.random() < fromLabeledProbability ? true : false

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

  return component.clone()
}

const addStatusBar = (frame: FrameNode, top: number, bottom: number, darkMode: boolean = false) => {
  const statusBar = getComponent("statusBar", 1)
  if (
    !statusBar ||
    !("resize" in statusBar)
  ) return 0

  frame.appendChild(statusBar)
  statusBar.name = "statusBar"
  statusBar.x = 0
  statusBar.y = 0
  statusBar.resize(frame.width, statusBar.height)

  if (
    "fills" in statusBar &&
    statusBar.fills !== figma.mixed &&
    statusBar.fills.length &&
    statusBar.fills[0].type === "SOLID" &&
    statusBar.fills[0].visible === true
  ) {
    const fillsHSL = RGBToHSL(statusBar.fills[0].color)
    if (
      darkMode &&
      fillsHSL.l < 25
    ) {
      statusBar.fills = [figma.util.solidPaint(hsl(fillsHSL.h, fillsHSL.s, 25))]
    } else if (
      !darkMode &&
      fillsHSL.l > 80
    ) {
      statusBar.fills = [figma.util.solidPaint(hsl(fillsHSL.h, fillsHSL.s, 80))]
    }
  }

  if ("findAll" in statusBar) {
    statusBar.findAll((node) => (true)).forEach((node) => {
      if (
        "fills" in node &&
        node.fills !== figma.mixed &&
        node.fills.length > 0 &&
        node.fills[0].type === "SOLID" &&
        node.fills[0].visible === true
      ) {
        const fillsHSL = RGBToHSL(node.fills[0].color)
        if (
          darkMode &&
          fillsHSL.l < 25
        ) {
          node.fills = [figma.util.solidPaint(hsl(fillsHSL.h, fillsHSL.s, 25))]
        } else if (
          !darkMode &&
          fillsHSL.l > 80
        ) {
          node.fills = [figma.util.solidPaint(hsl(fillsHSL.h, fillsHSL.s, 80))]
        }
      }
    })
  }

  return statusBar.height
}

const addHomeIndicator = (frame: FrameNode, top: number, bottom: number, darkMode: boolean = false) => {
  const homeIndicator = getComponent("homeIndicator", 1)
  if (!homeIndicator) return 0

  frame.appendChild(homeIndicator)
  homeIndicator.name = "homeIndicator"
  homeIndicator.x = (frame.width - homeIndicator.width) / 2
  homeIndicator.y = frame.height - (Math.random() * 20 + 5)

  if (
    "fills" in homeIndicator &&
    homeIndicator.fills !== figma.mixed &&
    homeIndicator.fills.length &&
    homeIndicator.fills[0].type === "SOLID" &&
    homeIndicator.fills[0].visible === true
  ) {
    const fillsHSL = RGBToHSL(homeIndicator.fills[0].color)
    if (
      darkMode &&
      fillsHSL.l < 25
    ) {
      homeIndicator.fills = [figma.util.solidPaint(hsl(fillsHSL.h, fillsHSL.s, 25))]
    } else if (
      !darkMode &&
      fillsHSL.l > 80
    ) {
      homeIndicator.fills = [figma.util.solidPaint(hsl(fillsHSL.h, fillsHSL.s, 80))]
    }
  }

  if ("findAll" in homeIndicator) {
    homeIndicator.findAll((node) => (true)).forEach((node) => {
      if (
        "fills" in node &&
        node.fills !== figma.mixed &&
        node.fills.length > 0 &&
        node.fills[0].type === "SOLID" &&
        node.fills[0].visible === true
      ) {
        const fillsHSL = RGBToHSL(node.fills[0].color)
        if (
          darkMode &&
          fillsHSL.l < 25
        ) {
          node.fills = [figma.util.solidPaint(hsl(fillsHSL.h, fillsHSL.s, 25))]
        } else if (
          !darkMode &&
          fillsHSL.l > 80
        ) {
          node.fills = [figma.util.solidPaint(hsl(fillsHSL.h, fillsHSL.s, 80))]
        }
      }
    })
  }

  return homeIndicator.y
}

const addText = (frame: FrameNode, darkMode: boolean = false) => {
  const text = figma.createText()
  frame.appendChild(text)

  const fontFamily = Object.keys(FONT_LIST)[Math.floor(Math.random() * Object.keys(FONT_LIST).length)]
  const fontStyle = FONT_LIST[fontFamily][Math.floor(Math.random() * FONT_LIST[fontFamily].length)]
  text.fontName = { family: fontFamily, style: fontStyle }

  const probFontSize = Math.random()
  if (probFontSize < 0.7) {
    text.fontSize = Math.floor(Math.random() * 4) + 12
    const textLength = Math.floor(Math.random() * 100) + 1
    text.characters = generateRandomString(textLength)
  } else if (probFontSize < 0.9) {
    text.fontSize = Math.floor(Math.random() * 8) + 16
    const textLength = Math.floor(Math.random() * 50) + 1
    text.characters = generateRandomString(textLength)
  } else {
    text.fontSize = Math.floor(Math.random() * 10) + 24
    const textLength = Math.floor(Math.random() * 10) + 1
    text.characters = generateRandomString(textLength)
  }

  const probTextAlignHorizontal = Math.random()
  if (probTextAlignHorizontal < 0.45) {
    text.textAlignHorizontal = "LEFT"
  } else if (probTextAlignHorizontal < 0.9) {
    text.textAlignHorizontal = "CENTER"
  } else {
    text.textAlignHorizontal = "JUSTIFIED"
  }

  text.letterSpacing = { value: Math.floor(Math.random() * 25) - 5, unit: "PERCENT" }
  text.lineHeight = { value: Math.floor(Math.random() * 40) + 80, unit: "PERCENT" }

  const color = darkMode ?
    hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 75, 100) :
    hsl(Math.random() * 360, Math.random() * 100, Math.random() * 80, 100)
  text.fills = [figma.util.solidPaint(color)]

  if (text.width > frame.width) {
    text.resize(frame.width - 20, text.height)
  }

  text.x = Math.floor(Math.random() * (frame.width - text.width))
  text.y = Math.floor(Math.random() * (frame.height - text.height))
}

const addImage = async (frame: FrameNode, darkMode: boolean = false) => {
  const randomWidth = Math.floor(Math.random() * 300) + 50
  const randomHeight = Math.floor(Math.random() * 300) + 50
  const image = await figma.createImageAsync(`https://picsum.photos/${randomHeight}/${randomWidth}`)

  const imageNode = figma.createRectangle()
  const { width, height } = await image.getSizeAsync()
  imageNode.resize(width, height)
  imageNode.fills = [
    {
      type: "IMAGE",
      imageHash: image.hash,
      scaleMode: "FILL",
    }
  ]

  frame.appendChild(imageNode)
  imageNode.x = Math.floor(Math.random() * (frame.width - imageNode.width))
  imageNode.y = Math.floor(Math.random() * (frame.height - imageNode.height))
  imageNode.cornerRadius = Math.floor(Math.random() * 25)
}

const addComponents = async (frame: FrameNode, classList: string[], darkMode: boolean = false) => {
  let top = 0
  let bottom = frame.height

  if (Math.random() < CLASSES_PROBOBILITY["homeIndicator"]) {
    top = addStatusBar(frame, top, bottom, darkMode)
    bottom = addHomeIndicator(frame, top, bottom, darkMode)
  }

  const autoLayout = figma.createFrame()
  autoLayout.fills = []
  frame.appendChild(autoLayout)
  autoLayout.x = 0
  autoLayout.y = top
  autoLayout.resize(frame.width, bottom - top)

  for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
    await addImage(autoLayout, darkMode)
  }

  for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
    addText(autoLayout, darkMode)
  }

  for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
    await addComponent(autoLayout, classList, darkMode)
  }

  // autoLayout.layoutMode = "HORIZONTAL"
  // autoLayout.layoutSizingHorizontal = "FIXED"
  // autoLayout.layoutSizingVertical = "FIXED"
  // autoLayout.resize(frame.width, bottom - top)
  // autoLayout.layoutWrap = "WRAP"
  // autoLayout.paddingLeft = 10
  // autoLayout.paddingRight = 10
  // autoLayout.paddingTop = 10
  // autoLayout.paddingBottom = 10
}

async function synthesize() {
  await loadFonts()

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

    if (Math.random() < 0.1) {
      randomFrameSize[1] = randomFrameSize[1] * 2
    } else if (Math.random() < 0.05) {
      randomFrameSize[1] = randomFrameSize[1] * 3
    }
    newFrame.resize(randomFrameSize[0], randomFrameSize[1])
    newFrame.name = `Frame ${i + 1}`

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

const detachAncestor = (node: SceneNode) => {
  if (node.removed || !node.parent || node.parent.type === "PAGE") return

  if (node.parent.type === "INSTANCE") {
    node.parent.detachInstance()
    return
  }

  if (
    node.parent.type === "COMPONENT" ||
    node.parent.type === "FRAME" ||
    node.parent.type === "GROUP"
  ) {
    detachAncestor(node.parent)
  }
}

async function replacing() {
  const uiList = figma.currentPage.findChildren(n => n.type === "FRAME").slice(0, 400)

  // Is there a page named "Synthetic Lab"?
  let syntheticLab = figma.root.findChild(page => page.name === "Synthesis Lab")

  if (!syntheticLab) {
    figma.closePlugin("Synthesis Lab page not found")
    return
  }

  figma.currentPage = syntheticLab

  // Is there a page named "Synthetic Pallete"?
  let syntheticPallete = figma.root.findChild(page => page.name === "Synthetic Pallete")

  if (!syntheticPallete) {
    figma.closePlugin("Synthetic Pallete page not found")
    return
  }

  const filledButtonSection = syntheticPallete.findChild((node) => node.type === "SECTION" && node.name === "filledButton")
  const outlinedButtonSection = syntheticPallete.findChild((node) => node.type === "SECTION" && node.name === "outlinedButton")

  if (
    !filledButtonSection ||
    filledButtonSection.type !== "SECTION" ||
    !outlinedButtonSection ||
    outlinedButtonSection.type !== "SECTION"
  ) {
    figma.closePlugin("Component section not found")
    return
  }

  const buttonList = filledButtonSection.children.concat(outlinedButtonSection.children)

  let frameX = 0
  let frameY = 0
  let maxFrameY = 0
  for (let i = 0; i < 400; i++) {
    console.log("looping:", i);

    const ui = uiList[i].clone() as FrameNode
    syntheticLab.appendChild(ui)
    ui.x = frameX
    ui.y = frameY

    if (frameY + ui.height > maxFrameY) {
      maxFrameY = frameY + ui.height
    }

    frameX += ui.width + 10
    if ((i + 1) % 50 === 0) {
      frameX = 0
      frameY = maxFrameY + 10
    }

    let isThereButton = false

    ui.findAll(n => n.name.toUpperCase() === "FILLEDBUTTON" || n.name.toUpperCase() === "OUTLINEDBUTTON").forEach(n => {
      isThereButton = true
      detachAncestor(n)
    })

    if (!isThereButton) {
      ui.remove()
      continue
    }

    const existingButtons = ui.findAll(n => n.name.toUpperCase() === "FILLEDBUTTON" || n.name.toUpperCase() === "OUTLINEDBUTTON")
    
    for(const n of existingButtons) {
      let subIndex = Math.floor(Math.random() * buttonList.length)

      for (let j = 0; j <= buttonList.length; j++) {
        if (
          n.width + 20 > buttonList[subIndex].width ||
          n.height + 20 > buttonList[subIndex].height
        ) break

        subIndex = (subIndex + 1) % buttonList.length
      }

      const subComponent = buttonList[subIndex].clone()
      n.parent?.appendChild(subComponent)
      subComponent.x = n.x + (n.width - subComponent.width) / 2
      subComponent.y = n.y + (n.height - subComponent.height) / 2

      // Change the text
      if (
        Math.random() < 0.9 &&
        subComponent.type === "INSTANCE" ||
        subComponent.type === "COMPONENT" ||
        subComponent.type === "FRAME" ||
        subComponent.type === "GROUP"
      ) {
        const textNodes = subComponent.findAll((node) => node.type === "TEXT")
        for (const text of textNodes) {
          if (
            text.type !== "TEXT" ||
            text.hasMissingFont ||
            text.fills === figma.mixed ||
            !text.fills.length ||
            text.fills[0].visible === false
          ) continue

          await Promise.all(
            text.getRangeAllFontNames(0, text.characters.length)
              .map(figma.loadFontAsync)
          )

          text.characters = generateRandomString(text.characters.length)

          const a = text.fills[0].opacity ? text.fills[0].opacity : 1
          const color = hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 55, a * 100)
          text.fills = [figma.util.solidPaint(color)]
        }
      }

      // Change the color for outlined button
      if (
        Math.random() < 0.9 &&
        subComponent.name.toUpperCase() === "OUTLINEDBUTTON"
      ) {
        if (
          "strokes" in subComponent &&
          subComponent.strokes.length
        ) {
          // If the component has strokes
          const a = subComponent.strokes[0].opacity ? subComponent.strokes[0].opacity : 1
          const color = hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 55, a * 100)

          subComponent.strokes = [figma.util.solidPaint(color)]
        } else {
          // If the component doesn't have strokes
          if (subComponent.type === "GROUP") {
            const rect = subComponent.findOne((node) => node.type === "RECTANGLE")
            if (
              rect &&
              rect.type === "RECTANGLE" &&
              "strokes" in rect &&
              rect.strokes.length
            ) {
              const a = rect.strokes[0].opacity ? rect.strokes[0].opacity : 1
              const color = hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 55, a * 100)
              rect.strokes = [figma.util.solidPaint(color)]
            }
          }
        }
      } else if (
        Math.random() < 0.9 &&
        subComponent.name.toUpperCase() === "FILLEDBUTTON"
      ) {
        // Change the color for filled button
        if (
          "strokes" in subComponent &&
          subComponent.strokes.length
        ) {
          // If the component has strokes
          const a = subComponent.strokes[0].opacity ? subComponent.strokes[0].opacity : 1
          const color = hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 55, a * 100)

          subComponent.strokes = [figma.util.solidPaint(color)]
        }

        if (
          "fills" in subComponent &&
          subComponent.fills !== figma.mixed &&
          subComponent.fills.length &&
          subComponent.fills[0].visible === true
        ) {
          // If the component has fills
          const a = subComponent.fills[0].opacity ? subComponent.fills[0].opacity : 1
          const color = hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 55, a * 100)
          subComponent.fills = [figma.util.solidPaint(color)]
        } else if (
          subComponent.type === "FRAME" ||
          subComponent.type === "COMPONENT" ||
          subComponent.type === "INSTANCE" ||
          subComponent.type === "GROUP"
        ) {
          // If the component doesn't have fills
          subComponent.findAll((node) => (
            node.type === "RECTANGLE" ||
            node.type === "ELLIPSE" ||
            node.type === "FRAME" ||
            node.type === "COMPONENT" ||
            node.type === "INSTANCE"
          )).forEach((node) => {
            if (
              !("fills" in node) ||
              node.fills === figma.mixed ||
              !node.fills.length ||
              node.fills[0].visible === false
            ) return

            const a = node.fills[0].opacity ? node.fills[0].opacity : 1
            const color = hsl(Math.random() * 360, Math.random() * 100, 25 + Math.random() * 55, a * 100)
            node.fills = [figma.util.solidPaint(color)]
          })
        }
      }

      n.remove()
    }
  }

  figma.closePlugin("Done🥰")
}

if (figma.command === "synthesize") {
  synthesize()
} else if (figma.command === "replacing") {
  replacing()
}