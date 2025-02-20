
let song 
let currentFolder;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format the minutes and seconds as two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

let currentSong = new Audio();



// get song ...........................................................
async function getSongs(folder) {
    currentFolder = folder
    let songs = await fetch(`http://127.0.0.1:3002/${folder}/`)
    let songName = await songs.text()
    let div = document.createElement("div")
    div.innerHTML = songName
    const data = div.getElementsByTagName("a")
    song = []
    
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.href.endsWith(".mp3")) {
            song.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
    let songUl = document.querySelector(".musicList").getElementsByTagName("ul")[0]
    songUl.innerHTML = " "
    for (const element of song) {
        // songUl.innerHTML = songUl.innerHTML + `<li>${element.replaceAll("%20", " ")}</li>`
        songUl.innerHTML = songUl.innerHTML + `                            <li>
                                <div class="songInfoLogo">
                                    <img src="music.svg" alt="">
                                    <div class="info">
                                        <div> ${element.replaceAll("%20", " ")}</div>
                                        <div>wajia ali</div>
                                    </div>
                                </div>

                                <div class="playLogo">
                                    <span>Play Now</span>
                                    <img width="30px" src="play.svg" alt="">
                                </div>
                            </li>`
    }

    // attach an event listener each song
    Array.from(document.querySelector(".box").getElementsByTagName("li")).forEach(e => {
        // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return song

}

const playMusic = (song, pause = false) => {
    currentSong.src = `/${currentFolder}/` + song
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(song)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"

}


// display albums function
async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3002/mysongs/`)
    let songName = await a.text()
    let div = document.createElement("div")
    div.innerHTML = songName
    console.log(div)
    let anchors =  div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
            
            if(e.href.includes("/mysongs")){
                let folder =  e.href.split("/").slice(-2)[0]
                console.log(e.href.split("/").slice(-2)[0])

            let a = await fetch(`http://127.0.0.1:3002/mysongs/${folder}/info.json`) 
      
            let response = await a.json()
         

            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder= ${folder} class="card">
                    <img class="img" src="/mysongs/${folder}/cover.jpg" alt="">
                    <h3>${response.title}</h3>
                    <div>${response.description}</div>
                </div>`
        }

    }


        // card add Eventlistener
        Array.from(document.getElementsByClassName("card")).forEach(e=>{
            e.addEventListener("click", async item=>{
                song = await getSongs(`mysongs/${item.currentTarget.dataset.folder}`)
                playMusic(song[0])
            })
        })
}



// main function......................................................................................
async function main() {

    // attention here wajid ali
    await getSongs("mysongs/ncs")

    playMusic(song[0], true)
    console.log(song)
    // var audio = new Audio(song[0])
    // audio.play()


    // display the albums on the page
    displayAlbums()

    // attech an event listener play, previous and next

    play.addEventListener("click", element => {
        if (currentSong.paused) {

            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    let a = "wajid ali"
    // previous and next add Event Listener
    previous.addEventListener("click", e => {
        // let index = song.indexOf(currentSong.src.split("/"))
        let index = song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {
            playMusic(song[index - 1])
        }
    })

    next.addEventListener("click", e => {
        let index = song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index + 1 <= song.length) {
            playMusic(song[index + 1])
        }
    })

    // song Time event Listener
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)} / 
        ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // seekBar..............................................................
    document.querySelector(".seekBar").addEventListener("click", e => {
        // document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)* 100+"%"
        // console.log(e.offsetX, e.target.getBoundingClientRect().width)
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        // console.log(percent)
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100

    })

    // hamBurger.....................................................................
    document.querySelector(".hamBurger").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0"
    })

    //close add Event listener
    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-250%"
    })

    // volume event lestener......................................................................
    document.querySelector("input").addEventListener("change", e => {
        currentSong.volume = (e.target.value) / 100
    })

    // silet add event listener
    document.querySelector(".range").getElementsByTagName("img")[0].addEventListener("click", e => {
        console.log(e.target.src)
        // e.target.src = "silent.svg"

        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "silent.svg")
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = "volume.svg"
            currentSong.volume = 40 / 100
            document.querySelector("input").value = 40
        }
    })
}
main()