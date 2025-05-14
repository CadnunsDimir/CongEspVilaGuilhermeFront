export function scrollBottom() {
    

    setTimeout(() => 
        scrollTo({
            top: document.body.scrollHeight+100,
            behavior: 'smooth'
        }));
}