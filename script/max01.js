const changeImage = event => {
    const card = event.target.closest('.tv-shows__item')
    
    if (card) {
        const img = card.querySelector('.tv-card__img')
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
        }
    }
};

tvShowsList.addEventListener('mouseover', changeImage)
tvShowsList.addEventListener('mouseout', changeImage)
