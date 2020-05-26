const tvShowsList = document.querySelector('.tv-shows__list')// обертка с карточками
const tvCardImg = document.querySelector('.tv-card__img')// обертка с карточками

function togglingImage(e) {
    const target = e.target
    const img = target.closest('.tv-card__img')
    const hasBackdrop = target.dataset.backdrop !== ''
    const tvCard = target.closest('.tv-card')

    if (img && tvCard && hasBackdrop) {
        const originalSrc = target.src
            const backSrc = target.dataset.backdrop
            target.src = backSrc
            if(target.src === backSrc) {
                target.addEventListener('mouseleave', () => {
                    target.src = originalSrc
                })
            }
        } 
    }
    
tvShowsList.addEventListener('mouseover', togglingImage)
