const sliderList = document.querySelector('.pets_slider_list');
const sliderBtnPrev = document.querySelector('.slider-prev');
const sliderBtnNext = document.querySelector('.slider-next');

let activeCard = 0; 
let show = 3; 
let newIndexes;

function createSliderCard(obj) {
    let li = document.createElement('li');
    let containerImg = document.createElement('div');
    let containerText = document.createElement('div');
    let img = document.createElement('img');
    let title = document.createElement('p');
    let btn = document.createElement('button');

    li.classList.add('pets_slider_item')
    containerImg.classList.add('pets_slider_item_img')
    containerText.classList.add('pets_slider_item_descr')
    title.classList.add('pets_slider_title')
    btn.classList.add('pets_slider_item_btn')

    img.setAttribute('src', obj.img)
    img.setAttribute('alt', obj.name)
    
    title.innerHTML = obj.name
    btn.innerHTML = 'Learn more'

    containerImg.append(img)
    containerText.append(title)
    containerText.append(btn)
    li.append(containerImg)
    li.append(containerText)
    return li
}

fetch('json/pets.json')
  .then(response => response.json())
  .then(result => {

    // find width
    function findWidth() {
        const stylesList = window.getComputedStyle(sliderList)
        if (window.innerWidth <= 767) {
            show = 1; 
            sliderList.style.width = (270 * show) + ((show-1) * parseFloat(stylesList.gap)) + 'px'
        } else if (window.innerWidth > 767 && window.innerWidth <= 1279) {
            show = 2; 
            sliderList.style.width = (270 * show) + ((show-1) * parseFloat(stylesList.gap)) + 'px' 
        } else if (window.innerWidth > 1279) {
            show = 3;
            sliderList.style.width = (270 * show) + ((show-1) * parseFloat(stylesList.gap)) + 'px'
        }
    }
    findWidth()

    // create random indexes 
    function createRandomIndexes(length, lastArr) {
        let arrNew = [];
        do {
            let random = Math.floor(Math.random() * result.length);
            if (!lastArr.includes(random) && !arrNew.includes(random)) {
                arrNew.push(random);
            }
        } while (arrNew.length < length);
        return arrNew;
    }
    let indexes = createRandomIndexes(show, []);

    function createInitSliderCard() {
        let newCard = createSliderCard(result[indexes[activeCard]]);
        newCard.dataset.object = indexes[activeCard];
        activeCard++
       return newCard;
    }

    function createSliderInitSlide() {
        let centerSlideIndexes = indexes;
        for (let i=0; i<show; i++) {
            sliderList.append(createInitSliderCard())
        }
        prevSlide(centerSlideIndexes)
        nextSlide(centerSlideIndexes)
    }

    function prevSlide(prevIndexes) {
        newIndexes = createRandomIndexes(show, prevIndexes);
        indexes = newIndexes;
        activeCard = 0;
        for (let i=0; i<show; i++) {
            sliderList.prepend(createInitSliderCard());
        }
    }

    function nextSlide(prevIndexes) {
        newIndexes = createRandomIndexes(show, prevIndexes);
        indexes = newIndexes;
        activeCard = 0;
        for (let i=0; i<show; i++) {
            sliderList.append(createInitSliderCard());
        }
    }

    createSliderInitSlide()

    // createSliderInitSlide() with change width
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 767) {
            if (show !== 1) {
                findWidth() 
                for (let i=sliderList.children.length-1; i>=0; i--) {
                    sliderList.children[i].remove()
                }
                activeCard = 0;
                indexes = createRandomIndexes(show, []);
                createSliderInitSlide()
            }
        } else if (window.innerWidth > 767 && window.innerWidth <= 1279) {
            if (show !== 2) {
                findWidth() 
                console.log(sliderList.children.length-1, 'sliderList.children.length')
                for (let i=sliderList.children.length-1; i>=0; i--) {
                    sliderList.children[i].remove()
                }
                activeCard = 0;
                indexes = createRandomIndexes(show, []);
                createSliderInitSlide()
            }
        } else if (window.innerWidth > 1279) {
            if (show !== 3) {
                findWidth() 
                for (let i=sliderList.children.length-1; i>=0; i--) {
                    sliderList.children[i].remove()
                }
                activeCard = 0;
                indexes = createRandomIndexes(show, []);
                createSliderInitSlide()
            }
        }
    })
    
    sliderBtnPrev.addEventListener('click', () => {
        prevSlide(newIndexes);
        for (let i=0; i<show; i++) {
            sliderList.children[sliderList.children.length - 1].remove();
        }
    })

    sliderBtnNext.addEventListener('click', () => {
        for (let i=0; i<show; i++) {
            if (sliderList.children.length > show * 2) {
                sliderList.children[0].remove();
            }
        }
        nextSlide(newIndexes);
    })
})