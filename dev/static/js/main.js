document.addEventListener('DOMContentLoaded', () => {



const options = {};
const scrollData = document.querySelector('[data-scroll]');
const btnScan = document.querySelector('#scan');
const progressContainer = document.querySelector('.progress__inner');
const indicator = document.querySelector('.speedometer__arrow');
const progressStatus = document.querySelector('.speedometer__status');
const speedometer = document.querySelector('.speedometer');
const driverList = document.querySelector('.driverCategory');
const driverDetails = document.querySelector('.driverDetails');
const buttonResult = document.querySelector('#progress-result');
const toggleItem = document.querySelector('.driverDetails__item');




// const el = document.querySelectorAll('.collapse');
// el.forEach(item => {
//     driverDetails.addEventListener('click', function(e) {
//         const collapse = new ItcCollapse(item);
//         let elem = e.target.closest('.driverDetails__item');
//         if (!elem) return;
//         if (!driverDetails.contains(elem)) return;
//         elem.querySelector('.driverDetails__toggle').classList.toggle('active');
//         console.log(elem.parentElement);
//         collapse.toggle();
//     });
// });



if(scrollData) {
    const scroll = new SimpleBar(scrollData, { autoHide: false });
    scroll.recalculate();
}


// переводим градусы в радианы
function getRadians(degree) {
	return Math.PI / 180 * degree;
}

// шаг отрисовки цветов (размер сектора) в радианах
options.step = 65;

// получаем угол начала прогресс бара в радианах
options.start = 0;


const meters = document.querySelectorAll('.meter');

const STATUS = ['VERY LOW', 'LOW', 'ALERT', 'HIGH'];
const STATUS_COLOR = ['#EF4444', '#FF8324', '#FFBC3B', '#68B842'];

meters.forEach(function(path, index) {
    let length = Math.ceil(path.getTotalLength());
    let countStep = null;
    // path.style.strokeDashoffset = length;
    // path.style.strokeDasharray = length;
   

    // Get the value of the meter
    let valuePath = parseInt(path.getAttribute('data-value'));
    // Calculate the percentage of the total length
    let to = length * ((100 - valuePath) / 100);

    // indicator.style.transform = `translate(-50%, -50%) rotate(${218}deg)`;
    
    // Trigger Layout in Safari hack https://jakearchibald.com/2013/animated-line-drawing-svg/
    path.getBoundingClientRect();

    // if (valuePath <= 25) {
    //     countStep = 25;
    //     progressStatus.textContent = `${STATUS[0]}`;
    //     progressStatus.style.color = `${STATUS_COLOR[0]}`;
    //     progressStatus.style.opacity = 1;
    //     path.style.strokeDashoffset = Math.max(0, to);
    //     indicator.style.transform = `translate(-50%, -50%) rotate(${countStep}deg)`;
    // }
    // if (valuePath <= 50) {
    //     countStep = 90;
    //     progressStatus.textContent = `${STATUS[1]}`;
    //     progressStatus.style.color = `${STATUS_COLOR[1]}`;
    //     progressStatus.style.opacity = 1;
    //     path.style.strokeDashoffset = Math.max(0, to);
    //     indicator.style.transform = `translate(-50%, -50%) rotate(${countStep}deg)`;
    // }
    // if (valuePath <= 75) {
    //     progressStatus.textContent = `${STATUS[2]}`;
    //     progressStatus.style.color = `${STATUS_COLOR[2]}`;
    //     progressStatus.style.opacity = 1;
    //     countStep = 155;
    //     path.style.strokeDashoffset = Math.max(0, to);
    //     indicator.style.transform = `translate(-50%, -50%) rotate(${countStep}deg)`;
    // }

    function speed(value, status, step) {
        if (valuePath <= value) {
            progressStatus.textContent = `${STATUS[status]}`;
            progressStatus.style.color = `${STATUS_COLOR[status]}`;
            progressStatus.style.opacity = 1;
            path.style.strokeDashoffset = Math.max(0, to);
            indicator.style.transform = `translate(-50%, -50%) rotate(${step}deg)`;
        }
    }

    btnScan?.addEventListener('click', hideContent);

    function hideContent() {
        let one = setTimeout(()=> {
            progressContainer.classList.add('hide');
            speedometer.classList.add('show');
            let two = setTimeout(()=> {
                clearTimeout(one);
                speed(50, 1, 90);
                axios.get('http://212.41.14.75:7177/api/v0.1/system/osinfo')
                    .then(function (response) {
                        const ul = document.createElement('ul');
                        for (let num of Object.values(response.data)) {
                            const li = document.createElement('li');
                            li.textContent = `${num}`;
                            ul.appendChild(li);
                        }
                        
                        document.querySelector('#data-list').appendChild(ul);
                        
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                let three = setTimeout(()=> {
                    clearTimeout(two);
                    driverList.classList.add('show');
                    let four = setTimeout(()=> {
                        clearTimeout(three);
                        buttonResult?.classList.add('show');
                        buttonResult?.addEventListener('click', function() {
                            document.querySelector('#data-list').style.display = 'none';
                            this.classList.remove('show');
                            speedometer.classList.remove('show');
                            driverDetails.classList.add('show');
                            clearTimeout(four);
                        });
                    },1500);
                },1000);
            }, 1000);
        }, 0);
    }
    
});


});