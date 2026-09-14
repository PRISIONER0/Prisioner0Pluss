/* =====================================================
   PRISIONER0 - ACERCA.JS
   Funciones de la página Acerca
===================================================== */


// =============================
// ACERCA DE PRISIONER0
// =============================

const aboutHeader = document.querySelector(".about-header");
const aboutHidden = document.querySelector(".about-hidden");
const aboutArrow = document.querySelector(".about-header i:last-child");


if (aboutHeader) {

    aboutHeader.addEventListener("click", function(){

        aboutHidden.classList.toggle("show");

        aboutArrow.classList.toggle("rotate");

    });

}



// =============================
// PREGUNTAS FRECUENTES
// =============================

const faqHeader = document.querySelector(".faq-header");
const faqHidden = document.querySelector(".faq-hidden");
const faqPreview = document.querySelector(".faq-preview");
const faqArrow = document.querySelector(".faq-header i:last-child");


if (faqHeader) {

    faqHeader.addEventListener("click", function(){

        faqHidden.classList.toggle("show");

        faqPreview.classList.toggle("hide");

        faqArrow.classList.toggle("rotate");

    });

}
header.classList.toggle("active");