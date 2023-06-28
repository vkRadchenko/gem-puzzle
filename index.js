const main = document.createElement('main')
const puzzleContainer = document.createElement('div')
const puzzleMenu = document.createElement('div')
const puzzleCounter = document.createElement('div')
const puzzleCanvas = document.createElement('div')
const puzzleSize = document.createElement('div')

const audioLink = '/gem-puzzle/assets/whoosh-grainy_g1lnqyn_.mp3'
const windowSize = document.documentElement.clientWidth
/////////////

main.classList.add('main')
puzzleContainer.classList.add('puzzle__container')
puzzleMenu.classList.add('menu')
puzzleCounter.classList.add('puzzleCounter')
puzzleCanvas.classList.add('puzzleCanvas')
puzzleSize.classList.add('puzzleSize')

/////////////

document.body.append(main)
main.append(puzzleContainer)
puzzleContainer.append(puzzleMenu, puzzleCounter, puzzleCanvas, puzzleSize)

/////////////

const movesContainer = document.createElement('div')
movesContainer.classList.add('movesContainer')
movesContainer.innerHTML = `<div><span>Moves:</span><span class=moveNum>0</span></div><div><span>Time:</span><span class=timeNum>00:00</span></div>`
puzzleCounter.append(movesContainer)

// Timer

const timerContainer = document.querySelector('.timeNum')

///////////////

///////////////

const frameSize = document.createElement('div')
frameSize.innerHTML = `<span>Frame size:</span> <span>4x4</span>`

const otherSize = document.createElement('div')
otherSize.classList.add('other__size')
otherSize.innerHTML = `<span>Other sizes:</span>`

const linkContainer = document.createElement('div')
linkContainer.classList.add('link__container')

for (let i = 3; i <= 8; i++) {
  const linkFrameSize = document.createElement('a')
  linkFrameSize.classList.add('link__size')
  linkFrameSize.href = '#'
  linkFrameSize.dataset.linkId = i
  linkFrameSize.innerText = `${i}x${i}`

  linkContainer.append(linkFrameSize)
}

puzzleSize.append(frameSize, otherSize)
otherSize.append(linkContainer)

//////////////

const createButtonMenu = (btnType, btnName, btnclas, text) => {
  const btnContainer = document.createElement('button')

  btnContainer.type = btnType
  btnContainer.name = btnName
  btnContainer.innerText = text

  btnContainer.classList.add('btn')
  btnContainer.classList.add(btnclas)

  puzzleMenu.append(btnContainer)

  return btnContainer
}

createButtonMenu('button', 'One', 'btn__1', 'Shuffle and start')
createButtonMenu('button', 'Two', 'btn__2', 'Mute')
createButtonMenu('button', 'Tree', 'btn__3', 'Save')
createButtonMenu('button', 'Foo', 'btn__4', 'Results')

// Audio

let song = new Audio(audioLink)
song.volume = 0.5
song.playbackRate = 2.5

const btnListenerMute = document.querySelector('.btn__2')

btnListenerMute.addEventListener('click', () => {
  if (song.muted === false) song.muted = true
  else song.muted = false
})

// Canvas /////////////

const zeroUnit = {
  value: 0,
  top: 0,
  left: 0,
}

let unitSize = 150
let counterMoves = 1

const puzzleNumSize = 15
if (windowSize < 600) {
  unitSize = 125
}
const test2 = document.querySelector('.moveNum')

const arrUnit = []
arrUnit.push(zeroUnit)

// Move

function move(index, b) {
  const puzzleBlok = arrUnit[index]

  const leftdiff = Math.abs(zeroUnit.left - puzzleBlok.left)
  const toptdiff = Math.abs(zeroUnit.top - puzzleBlok.top)

  if (leftdiff + toptdiff > 1) {
    return
  }

  puzzleBlok.element.style.left = `${zeroUnit.left * unitSize}px`
  puzzleBlok.element.style.top = `${zeroUnit.top * unitSize}px`

  const zeroUnitleft = zeroUnit.left
  const zeroUnitTop = zeroUnit.top

  zeroUnit.left = puzzleBlok.left
  zeroUnit.top = puzzleBlok.top

  puzzleBlok.left = zeroUnitleft
  puzzleBlok.top = zeroUnitTop

  const tr = arrUnit.filter(({ value }) => value > 0)

  const gameFinish = tr.every((puzzleBlok) => {
    console.log(puzzleBlok.value, puzzleBlok.top, puzzleBlok.left)
    console.log(puzzleBlok.value === puzzleBlok.top * b + puzzleBlok.left)
    console.log(tr)
    return puzzleBlok.value === puzzleBlok.top * b + puzzleBlok.left + 1
  })

  if (gameFinish)
    alert(
      `«Hooray! You solved the puzzle in ${timerContainer.innerText} and ${counterMoves} moves!»`
    )
  test2.innerText = counterMoves
  counterMoves += 1
  song.play()
}

const createPuzzleCanvas = (a, b) => {
  const arrNum = [...Array(a).keys()].sort(() => Math.random() - 0.5)
  for (let i = 1; i <= a; i++) {
    const puzzleBlok = document.createElement('div')
    const value = arrNum[i - 1] + 1

    puzzleBlok.classList.add('unit')
    puzzleBlok.dataset.unitId = i
    puzzleBlok.draggable = 'true'

    puzzleBlok.innerText = value

    const left = i % b
    const top = (i - left) / b

    arrUnit.push({
      value: value,
      left: left,
      top: top,
      element: puzzleBlok,
    })
    if (b === 3) {
      puzzleBlok.classList.add('unit__3')
      if (windowSize < 600) unitSize = 166.7
      else unitSize = 200
    }
    if (b === 5) {
      puzzleBlok.classList.add('unit__5')
      if (windowSize < 600) unitSize = 100
      else unitSize = 120
    }
    if (b === 6) {
      puzzleBlok.classList.add('unit__6')
      if (windowSize < 600) unitSize = 83.3
      else unitSize = 100
    }
    if (b === 7) {
      puzzleBlok.classList.add('unit__7')
      if (windowSize < 600) unitSize = 71.4
      else unitSize = 85.7
    }
    if (b === 8) {
      puzzleBlok.classList.add('unit__8')
      if (windowSize < 600) unitSize = 62.5
      else unitSize = 75
    }
    puzzleBlok.style.left = `${left * unitSize}px`
    puzzleBlok.style.top = `${top * unitSize}px`

    puzzleCanvas.append(puzzleBlok)

    puzzleBlok.addEventListener('click', (event) => {
      move(i, b)
      clearInterval(interval)
      interval = setInterval(startTimer, 10)
    })
  }
}

createPuzzleCanvas(puzzleNumSize, 4)

const shuffleFunc = (generateSizeNumber, b) => {
  const puzzleBlok = document.querySelectorAll('.unit')

  test2.innerText = 0
  counterMoves = 1

  arrUnit.splice(1, arrUnit.length)

  for (const prop of Object.keys(zeroUnit)) {
    zeroUnit[prop] = 0
  }

  puzzleBlok.forEach((unit) => {
    unit.remove('unit')
  })

  if (b === 3) {
    unitSize = 200
  }
  if (b === 4) {
    if (windowSize < 600) unitSize = 125
    else unitSize = 150
  }

  createPuzzleCanvas(generateSizeNumber, b)
}

let lTest = 0
const btnShuffle = document.querySelector('.btn__1')

linkContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('link__size')) {
    const { target } = event
    const { dataset } = target

    let canvasSizeNumber = Number(dataset.linkId)
    let generateSizeNumber = canvasSizeNumber ** 2 - 1
    lTest = canvasSizeNumber
    shuffleFunc(generateSizeNumber, canvasSizeNumber)

    minute = 0
    second = 0
    clearInterval(interval)
    timerContainer.innerHTML = '00x00'
    frameSize.innerHTML = `<span>Frame size:</span> <span>${lTest}x${lTest}</span>`
  }
})

// btn Shuffle and Start ///////////////
btnShuffle.addEventListener('click', (event) => {
  const puzzleBlok = document.querySelectorAll('.unit')

  if (lTest === 0) {
    test2.innerText = 0
    counterMoves = 1

    arrUnit.splice(1, arrUnit.length)

    for (const prop of Object.keys(zeroUnit)) {
      zeroUnit[prop] = 0
    }

    puzzleBlok.forEach((unit) => {
      unit.remove('unit')
    })

    createPuzzleCanvas(puzzleNumSize, 4)
  } else {
    let generateSizeNumber = lTest ** 2 - 1
    shuffleFunc(generateSizeNumber, lTest)
  }

  clearInterval(interval)
  minute = 0
  second = 0
  timerContainer.innerHTML = '00x00'
})

// variables
let minute = 0
let second = 0
let millisecond = 0
let interval

function startTimer() {
  millisecond++

  if (millisecond > 99) {
    second++
    millisecond = 0
  }
  if (second <= 9) {
    timerContainer.innerHTML = `${'0' + minute}:${'0' + second}`
  }
  if (second > 9) {
    timerContainer.innerHTML = `${'0' + minute}:${second}`
  }
  if (second > 60) {
    minute++
    timerContainer.innerHTML = `${'0' + minute}:S${second}`
    second = 0
  }
}
startTimer()

/* const puzzleBlok = document.querySelectorAll('.unit')

puzzleCanvas.ondragover = allowDrop

function allowDrop(event) {
  event.preventDefault()
}

puzzleBlok.ondragstart = drag

function drag(event) {
  event.dataTransfer.setData('unitId', event.target.dataset.unitId)
  console.log(event.target.dataset.unitId)
}

puzzleCanvas.ondrop = drop

function drop(event) {
  let classPuzzle = event.dataTransfer.getData('unitId')
  console.log('yap', classPuzzle)
  event.target.append(
    document.querySelector(`[data-unit-id = "${classPuzzle}"]`)
  )
}
 */
