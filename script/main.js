// Установка констант
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'
const API_KEY = 'eeca00c638c9554e87de2fe4f6de8a51'
const leftMenu = document.querySelector('.left-menu')
const menuHamburger = document.querySelector('.hamburger')
const tvShowsList = document.querySelector('.tv-shows__list')
const modal = document.querySelector('.modal')
const DBService = class {
    getData = async (url) => {
        const res = await fetch(url)
        if (res.ok) {
            return res.json()
        } else {
            throw new Error(`Не удалось ${url}`)
        }
    }
    getTestData = () => {
        return this.getData('test.json')
    }
}

// https://api.themoviedb.org/3/movie/550?api_key=eeca00c638c9554e87de2fe4f6de8a51
// const apiv4 = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWNhMDBjNjM4Yzk1NTRlODdkZTJmZTRmNmRlOGE1MSIsInN1YiI6IjVlY2Q2Yzg4NWJlMDBlMDAxZjk1ODczOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XGR5XJ2xrrUxLwcQDw1-AoWMkwie4fEM6jkjg8xBiAY'
const renderCard = response => {
    console.log(response);
    tvShowsList.textContent = ''
    response.results.forEach(item => {
        const {backdrop_path: backdrop, 
               name: title, 
               poster_path: poster, 
               vote_average: vote
        } = item
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg'
        const backdropIMG = backdrop ? IMG_URL + backdrop : ''
        const voteElem = vote > 0 ? `<span class="tv-card__vote">${vote}</span>` : ''
        const card = document.createElement('li')
        card.classList.add('tv-shows__item')
        card.innerHTML = `
        <a href="#" class="tv-card">
            ${voteElem}
            <img class="tv-card__img"
                src="${posterIMG}"
                data-backdrop="${backdropIMG}"
                alt="${title}">
            <h4 class="tv-card__head">${title}</h4>
        </a>
        `;
        tvShowsList.append(card)
    })
    
}
new DBService().getTestData().then(renderCard)

// Меню
// Открытие <-> закрытие меню
menuHamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu')
    menuHamburger.classList.toggle('open')
})

document.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        // console.log('not menu')
        leftMenu.classList.remove('openMenu')
        menuHamburger.classList.remove('open')
    } else {
        // console.log(event.target);
    }
})

leftMenu.addEventListener('click', event => {
    const target = event.target
    const dropdown = target.closest('.dropdown')
    if (dropdown) {
        dropdown.classList.toggle('active')
        leftMenu.classList.add('openMenu')
        menuHamburger.classList.add('open')
    }
})

// Открытие модального окна
tvShowsList.addEventListener('click', event => {
    event.preventDefault()
    const target = event.target
    console.log(target);
    const card = target.closest('.tv-card')
    if (card) {
        document.body.style.overflow = 'hidden'
        modal.classList.remove('hide')
    }
    
})

// Закрытие модального окна
modal.addEventListener('click', event => {
    console.log(event.target.classList.contains('modal'));
    if (event.target.closest('.cross') ||
        event.target.classList.contains('modal')) {
        document.body.style.overflow = ''
        modal.classList.add('hide')
    }
})