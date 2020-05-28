// Установка констант
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'

const leftMenu = document.querySelector('.left-menu')
const menuHamburger = document.querySelector('.hamburger')
const tvShowsList = document.querySelector('.tv-shows__list')
const modal = document.querySelector('.modal')
const tvShows = document.querySelector('.tv-shows')
const tvCardImg = document.querySelector('.tv-card__img')
const modalTitle = document.querySelector('.modal__title')
const searchForm = document.querySelector('.search__form')
const searchFormInput = document.querySelector('.search__form-input')
const preloader = document.querySelector('.preloader')
const genresList = document.querySelector('.genres-list')
const rating = document.querySelector('.rating')
const description = document.querySelector('.description')
const modalLink = document.querySelector('.modal__link')
const modalContent = document.querySelector('.modal__content')
const tvShowsHead = document.querySelector('.tv-shows__head')


const loading = document.createElement('div')
loading.classList.add('loading')

function modalLoader() {
    const loader = document.createElement('div')
    loader.classList.add('loading')
    modalContent.append(loader)
}



const DBService = class {
    constructor() {
        this.API_KEY = 'eeca00c638c9554e87de2fe4f6de8a51'
        this.SERVER = 'https://api.themoviedb.org/3'
    }
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
    getTestCard = () => {
        return this.getData('card.json')
    }
    getSearchResult = query => {
        return this.getData(this.SERVER + '/search/tv?api_key=' + this.API_KEY +
        '&language=ru-RU&query=' + query)
    }
    getTvShow = id => {
        return this.getData(this.SERVER + '/tv/' + id + '?api_key=' + this.API_KEY +
        '&language=ru-RU')
    }
}

const renderCard = response => {
    console.log(response);
    tvShowsList.textContent = ''
    response.results.forEach(item => {
        const {backdrop_path: backdrop, 
               name: title, 
               poster_path: poster, 
               vote_average: vote,
               id
        } = item
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg'
        const noposter = poster ? '' : 'no'
        const backdropIMG = backdrop ? IMG_URL + backdrop : ''
        const voteElem = vote > 0 ? `<span class="tv-card__vote">${vote}</span>` : ''
        const card = document.createElement('li')
        card.idTv = id
        card.classList.add('tv-shows__item')
        card.innerHTML = `
        <a href="#" id="${id}" class="tv-card" data-noposter="${noposter}">
            ${voteElem}
            <img class="tv-card__img"
                src="${posterIMG}"
                data-backdrop="${backdropIMG}"
                alt="${title}">
            <h4 class="tv-card__head">${title}</h4>
        </a>
        `;
        loading.remove()
        tvShowsList.append(card)
    })
    
}
{
    tvShows.append(loading)
    new DBService().getTestData().then(renderCard)
    //new DBService().getSearchResult().then(renderCard)
}


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

searchForm.addEventListener('submit', event => {
    event.preventDefault()
    const value = searchFormInput.value.trim()
    if (value) {
        //tvShows.append(loading)
        preloader.style.display = 'block'
        new DBService().getSearchResult(value)
        .then((data) => {
            if (data.results.length === 0) {
                preloader.style.display = ''
                tvShowsHead.textContent = 'По вашему запросу ничего не найдено'
                tvShowsList.innerHTML = '<img src="img/noresults.jpg" />'
            } else {
                preloader.style.display = ''
                tvShowsHead.innerHTML = 'Результат поиска по запросу ' + '&laquo;' + value + '&raquo;'
                renderCard(data)
            }
        })
    }
    searchFormInput.value = ''
})

// Открытие модального окна
tvShowsList.addEventListener('click', event => {
    event.preventDefault()
    
    
    
    const target = event.target
    console.log(target);
    const card = target.closest('.tv-card')
    
    if (card && card.dataset.noposter !== 'no') {
       console.log(card);
       preloader.style.display = 'block'
        new DBService().getTvShow(card.id)
        
        
            .then(({poster_path: posterPath, 
                name: title, 
                genres, 
                vote_average: voteAverage, 
                overview, 
                homepage,
                }) => {
                  
                tvCardImg.src = IMG_URL + posterPath
                modalTitle.textContent = title
                //genresList.innerHTML = data.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, '')
                genresList.textContent = ''
                // for (const item of data.genres) {
                //     genresList.innerHTML += `<li>${item.name}</li>`
                // }
                genres.forEach(item => {
                    genresList.innerHTML += `<li>${item.name}</li>`
                })
                rating.textContent = voteAverage
                description.textContent = overview
                modalLink.href = homepage
                
            })
            .then(() => {
                document.body.style.overflow = 'hidden'
                modal.classList.remove('hide')
                preloader.style.display = '' 
                
            }) 
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