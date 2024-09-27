const sliderList = document.querySelector('.pets_slider_list');
const page = document.querySelector('.pets_page_number');
const sliderBtnPrev = document.querySelector('.slider-prev');
const sliderBtnNext = document.querySelector('.slider-next');
const sliderBtnFirst = document.querySelector('.slider-first');
const sliderBtnLast = document.querySelector('.slider-last');

let activeCard = 0; 
let show = 8; 
let slide = 1;
let cards = 48;
let slides;
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
    containerText.classList.add('pets_slider_item_descr_col-4')
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
            show = 3; 
            slides = cards/show;
            sliderList.style.width = (270 * (show / 2)) + ((show / 2 - 1) * parseFloat(stylesList.gap)) + 'px'
        } else if (window.innerWidth > 767 && window.innerWidth <= 1279) {
            show = 6; 
            slides = cards/show;
            sliderList.style.width = (270 * (show / 2)) + ((show / 2 - 1) * parseFloat(stylesList.gap)) + 'px' 
        } else if (window.innerWidth > 1279) {
            show = 8;
            slides = cards/show;
            sliderList.style.width = (270 * (show / 2)) + ((show / 2 - 1) * parseFloat(stylesList.gap)) + 'px'
        }
    }
    findWidth()

    // create random indexes 
    function createRandomIndexes(length) {
        let arrNew = [];
        do {
            let random = Math.floor(Math.random() * result.length);
            if (!arrNew.includes(random)) {
                arrNew.push(random);
            }
        } while (arrNew.length < length);
        return arrNew;
    }
    let indexes = [];

    
    function checkTriple(arr) {
        for (let i=0; i<arr.length; i+=3) {
            let triple1 = arr.slice(i, i+3);
            let triple2 = arr.slice(i+3, i+6);
            for (let d=0; d<triple1.length; d++) {
                if (triple1[d] == triple1[d+1] || triple1[d] == triple1[d+2]) return false
            }
            for (let j=0; j<triple2.length; j++) {
                if (triple1.includes(triple2[j])) {
                    return false
                }
            }
        }
        
        return true
    }

    for (let i=0; i<cards/result.length; i++) {
        let newIndexes
        let arrLength = indexes.length
        do {
            indexes = indexes.slice(0, arrLength);
            newIndexes = createRandomIndexes(result.length);
            indexes = indexes.concat(newIndexes);
            checkTriple(indexes)
        } while (!checkTriple(indexes))
    }

    function createInitSliderCard() {
        for (let i=0; i<indexes.length; i++) {
            let newCard = createSliderCard(result[indexes[activeCard]]);
            newCard.dataset.object = indexes[activeCard];
            sliderList.append(newCard)
            activeCard++
        }
    }
    createInitSliderCard()

    function createSliderInitSlide() {
        slide = 1;
        if (+page.innerHTML > cards/show) {
            page.innerHTML = cards/show
        }
        for (let i = 0; i<sliderList.children.length; i++) {
            if (i % show === 0 && i !== 0) {
                slide++
            }
            sliderList.children[i].dataset.slide = slide;
        }
        slide = page.innerHTML;
    }
    createSliderInitSlide()

    function initPageSlide() {
        for (let i = 0; i<sliderList.children.length; i++) {
            if (page.innerHTML !== sliderList.children[i].dataset.slide) {
                sliderList.children[i].hidden = true
            } else {
                sliderList.children[i].hidden = false
            }
        }
        if (page.innerHTML == 1) {
            sliderBtnFirst.classList.remove('arrow_active');
            sliderBtnPrev.classList.remove('arrow_active');
            sliderBtnFirst.classList.add('arrow_disabled');
            sliderBtnPrev.classList.add('arrow_disabled');

            sliderBtnFirst.disabled = true;
            sliderBtnPrev.disabled = true;
            sliderBtnNext.disabled = false;
            sliderBtnLast.disabled = false;

            sliderBtnNext.classList.remove('arrow_disabled');
            sliderBtnLast.classList.remove('arrow_disabled');
            sliderBtnNext.classList.add('arrow_active');
            sliderBtnLast.classList.add('arrow_active');
        } else if (page.innerHTML > 1 && page.innerHTML < slides) {
            sliderBtnFirst.classList.remove('arrow_disabled');
            sliderBtnPrev.classList.remove('arrow_disabled');
            sliderBtnFirst.classList.add('arrow_active');
            sliderBtnPrev.classList.add('arrow_active');

            sliderBtnFirst.disabled = false;
            sliderBtnPrev.disabled = false;
            sliderBtnNext.disabled = false;
            sliderBtnLast.disabled = false;

            sliderBtnNext.classList.remove('arrow_disabled');
            sliderBtnLast.classList.remove('arrow_disabled');
            sliderBtnNext.classList.add('arrow_active');
            sliderBtnLast.classList.add('arrow_active');
        } else if (page.innerHTML = slides) {
            sliderBtnFirst.classList.remove('arrow_disabled');
            sliderBtnPrev.classList.remove('arrow_disabled');
            sliderBtnFirst.classList.add('arrow_active');
            sliderBtnPrev.classList.add('arrow_active');

            sliderBtnFirst.disabled = false;
            sliderBtnPrev.disabled = false;
            sliderBtnNext.disabled = true;
            sliderBtnLast.disabled = true;

            sliderBtnNext.classList.remove('arrow_active');
            sliderBtnLast.classList.remove('arrow_active');
            sliderBtnNext.classList.add('arrow_disabled');
            sliderBtnLast.classList.add('arrow_disabled');
        }
    }
    initPageSlide()

    // createSliderInitSlide() with change width
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 767) {
            if (show !== 3) {
                findWidth();
                createSliderInitSlide();
                initPageSlide();
            }
        } else if (window.innerWidth > 767 && window.innerWidth <= 1279) {
            if (show !== 6) {
                findWidth();
                createSliderInitSlide();
                initPageSlide();
            }
        } else if (window.innerWidth > 1279) {
            if (show !== 8) {
                findWidth();
                createSliderInitSlide();
                initPageSlide();
            }
        }
    })

    sliderBtnPrev.addEventListener('click', () => {
        page.innerHTML--;
        initPageSlide(slide);
    })

    sliderBtnNext.addEventListener('click', () => {
        page.innerHTML++;
        initPageSlide(slide);
    })

    sliderBtnFirst.addEventListener('click', () => {
        page.innerHTML = 1;
        initPageSlide(slide);
    })

    sliderBtnLast.addEventListener('click', () => {
        page.innerHTML = slides;
        initPageSlide(slide);
    })
    
})