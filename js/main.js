// burger

document.querySelector('.burger').addEventListener('click', () => {
    document.querySelector('.header_nav').classList.toggle('burger_open');
    document.body.classList.toggle('overflowHidden');
})

document.body.addEventListener('click', (event) => {
    if (event.target.className === 'darker') {
        document.querySelector('.header_nav').classList.remove('burger_open');
        document.body.classList.remove('overflowHidden');
    }
    
    for (let burgerLink of document.querySelectorAll('.header_item_link')) {
        burgerLink.addEventListener('click', () => {
            document.querySelector('.header_nav').classList.remove('burger_open');
            document.body.classList.remove('overflowHidden');
        })
    }
})

function createModalCard(indexCard) {
    let container = document.createElement('div');
    let containerCard = document.createElement('div');
    let btn = document.createElement('btn');
    let containerImg = document.createElement('div');
    let containerText = document.createElement('div');
    let img = document.createElement('img');
    let name = document.createElement('h3');
    let typeBreed = document.createElement('p');
    let desc = document.createElement('p');
    let list = document.createElement('ul');
    let darker = document.createElement('div');

    container.classList.add('pets_modal_container');
    containerCard.classList.add('pets_modal_container_card');
    containerImg.classList.add('pets_modal_container_img');
    containerText.classList.add('pets_modal_container_text');
    btn.classList.add('pets_modal_btn');
    img.classList.add('pets_modal_img');
    name.classList.add('pets_modal_name');
    typeBreed.classList.add('pets_modal_typeBreed');
    desc.classList.add('pets_modal_desc');
    list.classList.add('pets_modal_list');
    darker.classList.add('darker');
    
    const svgCode = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.42618 6.00003L11.7046 1.72158C12.0985 1.32775 12.0985 0.689213 11.7046 0.295433C11.3108 -0.0984027 10.6723 -0.0984027 10.2785 0.295433L5.99998 4.57394L1.72148 0.295377C1.32765 -0.098459 0.68917 -0.098459 0.295334 0.295377C-0.0984448 0.689213 -0.0984448 1.32775 0.295334 1.72153L4.57383 5.99997L0.295334 10.2785C-0.0984448 10.6723 -0.0984448 11.3108 0.295334 11.7046C0.68917 12.0985 1.32765 12.0985 1.72148 11.7046L5.99998 7.42612L10.2785 11.7046C10.6723 12.0985 11.3108 12.0985 11.7046 11.7046C12.0985 11.3108 12.0985 10.6723 11.7046 10.2785L7.42618 6.00003Z" fill="#292929"/></svg>';
    btn.innerHTML = svgCode;   
    fetch('json/pets.json')
    .then(response => response.json())
    .then(result => {
        name.innerHTML = result[indexCard].name
        img.setAttribute('src', result[indexCard].img);
        img.setAttribute('alt', result[indexCard].name);
        typeBreed.innerHTML = result[indexCard].type + ' - ' + result[indexCard].breed;
        desc.innerHTML = result[indexCard].description
        for (let property of ['age', 'inoculations', 'diseases', 'parasites']) {
            let item = document.createElement('li');
            item.classList.add('pets_modal_list_item');
            item.innerHTML = `<span class='pets_item_dot'></span>`
            item.innerHTML += `<strong>${property.charAt(0).toUpperCase() + property.slice(1)}: </strong>${result[indexCard][property]}`;
            list.append(item);
        }
    })

    
    function findWidth() {
        if (window.innerWidth <= 767) {
            containerImg.style.display = 'none'
        } else if (window.innerWidth > 767 && window.innerWidth <= 1279) {
            containerImg.style.display = 'inline'
            containerImg.style.minWidth = '350px'
        } else if (window.innerWidth > 1279) {
            containerImg.style.display = 'inline'
            containerImg.style.minWidth = '500px'
        }
    }
    findWidth()
    window.addEventListener('resize', () => { 
        findWidth()
    })

    containerText.append(name);
    containerText.append(typeBreed);
    containerText.append(desc);
    containerText.append(list);
    containerImg.append(img);
    containerCard.append(containerImg);
    containerCard.append(containerText);
    container.append(btn);
    container.append(containerCard);
    container.append(darker);

    return container
}

document.querySelector('.pets_slider_list').addEventListener('click', (event) => {
    let target = event.target.closest('.pets_slider_item');
    if (!target) return
    document.body.append(createModalCard(target.dataset.object))
     
    const modalContainer = document.querySelector('.pets_modal_container');
    const btn = document.querySelector('.pets_modal_btn');
    
    modalContainer.style.top = window.scrollY + window.innerHeight / 2 - modalContainer.clientHeight / 2+ 'px';
    modalContainer.style.left = (document.body.clientWidth - document.querySelector('.pets_modal_container_card').clientWidth) / 2 + 'px';

    let scrollY = window.scrollY;
    document.body.style.setProperty('--scroll-position', `${scrollY}px`);
    document.body.classList.add('no-scroll');

    function rememberScroll(scroll) {
        document.body.style.removeProperty('--scroll-position');
        document.body.classList.remove('no-scroll');
        window.scrollTo(0, scroll);
        modalContainer.remove();
    }
    btn.addEventListener('click', () => { 
        rememberScroll(scrollY)
    })
    document.body.addEventListener('click', (event) => {
        if (event.target.className === 'darker') {
            rememberScroll(scrollY)
        }
    })

    window.addEventListener('resize', () => {
        modalContainer.style.top = scrollY + window.innerHeight / 2 - modalContainer.clientHeight / 2+ 'px';
        modalContainer.style.left = (document.body.clientWidth - document.querySelector('.pets_modal_container_card').clientWidth) / 2 + 'px';
    })
})

