const tabs = [...document.querySelectorAll('.tab')];
const allPages = [...document.querySelectorAll('main.app, main.page')];

tabs.forEach(btn =>
    btn.addEventListener('click', () => {
        // mark the clicked tab
        tabs.forEach(t => t.classList.toggle('active', t === btn));

        // show the requested page, hide the rest
        const targetId = btn.dataset.target;
        allPages.forEach(p =>
            p.classList.toggle('hide', p.id !== targetId)
        );
    })
);
