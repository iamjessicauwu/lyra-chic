window.addEventListener('DOMContentLoaded', () => {
    const ads = document.querySelectorAll('.ad');
    const adBanner = document.querySelector('.ad-banner');
    const closeBanner = document.querySelector('.ad-banner .btn.close');
    const isBannerClosed = localStorage.getItem('banner-closed') === true;

    if (isBannerClosed) {
        adBanner.classList.add('hidden');
    }

    setTimeout(() => {
        adBanner.classList.remove('hidden');
    }, 5000);

    closeBanner.addEventListener('click', () => {
        adBanner.classList.add('hidden');
        localStorage.setItem('banner-closed', "true");
    });

    ads.forEach(ad => {
        ad.addEventListener('click', (event) => {
            if (event.target.closest('.ad-banner .btn.close')) {
                window.location.href = '#';
            } else {
                window.location.href = 'https://google.com';
            }
        })
    })
});