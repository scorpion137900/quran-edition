//Explore button 
let exploreBtn = document.querySelector('.title .btn'),
    HadithSection = document.querySelector('.hadith');
if (exploreBtn) {

    exploreBtn.addEventListener('click', () => {
        HadithSection.scrollIntoView({
            behavior: "smooth"
        })
    })
}
let fixedNav = document.querySelector('.header'),
    scrollBtn = document.querySelector('.scrollBtn');
window.addEventListener("scroll", () => {
    window.scrollY > 100 ? fixedNav.classList.add('active') : fixedNav.classList.remove('active');
    window.scrollY > 500 ? scrollBtn.classList.add('active') : scrollBtn.classList.remove('active');
})
if (scrollBtn) {

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    })
}


// Link Sections
let sections = document.querySelectorAll("section"),
    links = document.querySelectorAll('.header ul li');
if (sections && links) {

    links.forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.header ul li.active').classList.remove('active');
            link.classList.add('active');
            let target = link.dataset.filter;
            sections.forEach(section => {
                if (section.classList.contains(target)) {
                    section.scrollIntoView({
                        behavior: "smooth"
                    })
                }
            })
        })
    })
}
//Surah Api
let SurahsContainer = document.querySelector('.surhasContainer');
const metaUrl = "https://api.alquran.cloud/v1/meta";
const surahsUrl = (number) => `https://api.alquran.cloud/v1/surah/${number}/editions/ar,ar.muyassar`;
const popup = document.querySelector('.surah-popup');
const QuranLoader = document.querySelector(".quran-loader")
if (SurahsContainer) getSurahs();


async function getSurahs() {
    try {
        const surahs = await fetchSurahsMetaData();
        const numberOfSurahs = 114;

        clearElementContent(SurahsContainer);
        renderSurahs(numberOfSurahs, surahs);

        setupSurahTitleEventListeners();

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function fetchSurahsMetaData() {
    const metaResponse = await fetch(metaUrl);
    const metaData = await metaResponse.json();
    return metaData?.data?.surahs?.references || [];
}

function clearElementContent(element) {
    element.innerHTML = "";
}

function setupSurahTitleEventListeners() {
    const SurahsTitles = document.querySelectorAll('.surah');
    const AyatContainer = document.querySelector('.ayat');

    SurahsTitles.forEach((title, index) => {
        title.addEventListener('click', async () => {
            QuranLoader.style.display = "flex";

            const surahDetails = await fetchSurahDetails(index + 1);
            AyatContainer.innerHTML = "";
            const ayat = surahDetails?.data[0]?.ayahs;
            AyatContainer.innerHTML += `
                <h2>${surahDetails.data[0].name}</h2>
            `;
            popup.classList.add('active');
            renderAyatDetails(AyatContainer, ayat, surahDetails.data[1]?.ayahs);

            QuranLoader.style.display = "none";
        });
    });
}

async function fetchSurahDetails(index) {
    const surahResponse = await fetch(surahsUrl(index));
    return await surahResponse.json();
}

function renderAyatDetails(container, ayat, translations) {
    ayat.forEach((aya, index) => {
        container.innerHTML += `
            <div class="surah-details">
                <p>  
                    ${aya?.sajda ? "<span class='sajda'> &#1769;</span>" : ""}
                    (${aya?.numberInSurah}) - ${aya?.text}
                </p>
                <p>  
                    ${translations[index]?.text || ""}
                </p>
            </div>
        `;
    });
}

let closePopup = document.querySelector('.close-popup');
if (closePopup) {
    closePopup.addEventListener('click', () => {
        if (popup) popup.classList.remove('active');
        if (RecPopup) RecPopup.classList.remove('active');
    });
}
function renderSurahs(numberOfSurahs, surahs) {
    for (let i = 0; i < numberOfSurahs; i++) {
        SurahsContainer.innerHTML +=
            `
            <div class="surah">
                <p>${surahs[i]?.name}</p>
                <p>${surahs[i]?.englishName}</p>
                <p>${surahs[i]?.revelationType === "Meccan" ? "مكية" : "مدنية"}</p>
                <p>  عدد الآيات ${surahs[i]?.numberOfAyahs}</p>
            </div>
        `;
    }
}
//PrayTime Api
let cards = document.querySelector('.cards');
if (cards) getPrayTimes();
function getPrayTimes() {
    fetch("http://api.aladhan.com/v1/timingsByCity?city=cairo&country=egypt&method=8")
        .then(response => response.json())
        .then(data => {
            let times = data.data.timings;
            cards.innerHTML = "";
            for (let time in times) {

                cards.innerHTML +=
                    `
                <div class="card">
                    <div class="circle">
                        <svg>
                            <Circle cx="100" cy = "100" r ="100"></Circle>
                        </svg>
                        <div class="praytime">${times[time]}</div>
                    </div>
                    <p>${time}</p>
                </div>
            `
            }
        })
}
//Active SideBar
let bars = document.querySelector('.bars'),
    SideBar = document.querySelector('.header ul');
bars.addEventListener('click', () => {
    SideBar.classList.toggle("active");
})

const Loader = document.querySelector(".loader-container");
const hadithTypeButtonsContainer = document.querySelector('.hadith .container .type-buttons');
const hadithContainer = document.querySelector('.hadithContainer');
const next = document.querySelector('.buttons .next');
const prev = document.querySelector('.buttons .prev');
const number = document.querySelector('.buttons .number');

const showLoader = () => {
    setTimeout(() => {
        Loader.classList.remove('hide');
    }, 1000);
};

const hideLoader = () => {
    setTimeout(() => {
        Loader.classList.add('hide');
    }, 1000);
    console.log("Loading complete!");
};

const handleButtonClick = async (e) => {
    console.log(e.target.dataset.link);
    const link = e.target.dataset?.link;

    hadithTypeButtonsContainer.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");

    const data = await fetchData(link);
    console.log(data);

    let hadithIndex = 0;
    const Hadiths = data?.hadiths;

    changeHadith(Hadiths, hadithIndex);

    next.addEventListener('click', () => {
        hadithIndex == Hadiths.length - 1 ? hadithIndex = 0 : hadithIndex++;
        updateHadithIndex(1, hadithIndex, Hadiths);
    });
    prev.addEventListener('click', () => {
        hadithIndex == 0 ? hadithIndex = Hadiths.length - 1 : hadithIndex--;
        updateHadithIndex(-1, hadithIndex, Hadiths);
    });
};

const updateHadithIndex = (inc, hadithIndex, Hadiths) => {

    changeHadith(Hadiths, hadithIndex);
};

const changeHadith = (Hadiths, hadithIndex) => {
    hadithContainer.innerText = Hadiths[hadithIndex].text;
    number.innerText = `${Hadiths.length} - ${hadithIndex + 1}`;
};

const fetchData = async (link) => {
    const resp = await fetch(link);
    console.log(resp)
    return await resp.json();
};

const fetchHadiths = async () => {
    try {
        const res = await fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json");
        const data = await res.json();

        hadithTypeButtonsContainer.innerHTML = "";
        console.log(data);

        for (const key in data) {
            if (data?.hasOwnProperty(key)) {
                const { name, collection } = data[key];
                console.log(name);

                hadithTypeButtonsContainer.innerHTML += `<button data-link=${collection?.[0]?.linkmin}>${name}</button>`;
            }
        }

        const hadithTypeButtons = Array.from(hadithTypeButtonsContainer.querySelectorAll("button"));
        hadithTypeButtons[0].classList.add("active");

        showLoader();

        const firstShowedHadiths = await fetchData(hadithTypeButtons[0].dataset.link);
        let hadithFirstIndex = 0;
        const hadithsData = firstShowedHadiths?.hadiths;

        changeHadith(hadithsData, hadithFirstIndex);

        hideLoader();

        next.addEventListener('click', () => {
            hadithFirstIndex == hadithsData.length - 1 ? hadithFirstIndex = 0 : hadithFirstIndex++;
            updateHadithIndex(1, hadithFirstIndex, hadithsData);
        });

        prev.addEventListener('click', () => {
            hadithFirstIndex == 0 ? hadithFirstIndex = hadithsData.length - 1 : hadithFirstIndex--;
            updateHadithIndex(-1, hadithFirstIndex, hadithsData);
        });

        hadithTypeButtons.forEach((button) => {
            button.addEventListener("click", async (e) => {
                showLoader();
                await handleButtonClick(e);
                hideLoader();
            });
        });
    } catch (error) {
        // Handle error
    }
};

fetchHadiths();
//Load Iframes
const LecturesIframes = document.querySelectorAll('.lec-boxes iframe');
console.log(LecturesIframes);
if (LecturesIframes) {
    Array.from(LecturesIframes)?.map(iframe => {
        iframe.addEventListener('load', () => {
            console.log(iframe.parentElement);
            const LecBox = iframe.parentElement
            const Loader = LecBox.querySelector(".loader-container")
            Loader.classList.add('hide');
        });
    })
}

//Quran Filter
let timeoutId;
let timeoutRId;
let quranSearcher = document.querySelector(".quran-surah-search input")
let RectierSearcher = document.querySelector(".reciter-search input")

// Global variable to store the timeout ID
if (quranSearcher) quranSearcher.addEventListener("input", handleSearchInput);
if (RectierSearcher) RectierSearcher.addEventListener("input", handleSearchReciterInput);

// Function to handle search input with throttling
function handleSearchInput() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        performSearch(".surah", quranSearcher)
    }, 1000);
}
function handleSearchReciterInput() {
    clearTimeout(timeoutRId);
    timeoutRId = setTimeout(() => {
        performSearch(".reciter", RectierSearcher)
    }, 1000);
}

// Function to perform the search
function performSearch(className, inputEl) {
    const elements = document.querySelectorAll(className);

    Array.from(elements)?.map((el) => {
        resetElStyles(el);

        const title = el.children[0].innerText.toLowerCase();
        const searchValue = inputEl.value.toLowerCase();

        if (!title.includes(searchValue)) hideWithDelay(el);
    });
}


function resetElStyles(el) {
    el.classList.remove("hidden");
    el.classList.remove("hide");
}

// Function to hide surah with a delay
function hideWithDelay(el) {
    el.classList.add("hide");
    setTimeout(() => {
        el.classList.add("hidden");
    }, 500);
}


//Quran audio
const rectiresContainer = document.querySelector(".rectiresContainer")
const RectiersMetaUrL = "https://www.mp3quran.net/api/v3/reciters?language=ar"
if (rectiresContainer) getRectiers();
async function getRectiers() {
    try {
        const reciters = await fetchRecitersMetaData();

        clearElementContent(rectiresContainer);
        renderRectiers(reciters)

        setupRecitersEventListeners()
        console.log(reciters)

    } catch (error) {
        console.error('An error occurred:', error);
    }
}


async function fetchRecitersMetaData() {
    const metaResponse = await fetch(RectiersMetaUrL);
    const metaData = await metaResponse.json();
    return metaData?.reciters || [];
}
function renderRectiers(reciters) {
    for (let i = 0; i < reciters?.length; i++) {
        rectiresContainer.innerHTML +=
            `
            <div class="reciter" data-id=${reciters[i]?.id}>
                <p>${reciters[i]?.name}</p>
            </div>
        `;
    }
}
const RecPopup = document.querySelector('.rectiers-popup');
function setupRecitersEventListeners() {
    const RecitersTitles = document.querySelectorAll('.reciter');

    const RecContainer = document.querySelector('.records');

    RecitersTitles.forEach((title) => {
        title.addEventListener('click', async () => {
            console.log("object")
            QuranLoader.style.display = "flex";

            const ReciterDetails = await fetchReciter(title?.dataset.id);
            console.log(ReciterDetails)
            // RecContainer.innerHTML = "";
            // const ayat = surahDetails?.data[0]?.ayahs;
            // RecContainer.innerHTML += `
            //     <h2>${surahDetails.data[0].name}</h2>
            // `;
            RecPopup.classList.add('active');
            // renderAyatDetails(AyatContainer, ayat, surahDetails.data[1]?.ayahs);

            QuranLoader.style.display = "none";
        });
    });
}

async function fetchReciter(index) {
    const Response = await fetch(`https://mp3quran.net/api/v3/reciters?reciter=${index}`);
    return await Response.json();
}