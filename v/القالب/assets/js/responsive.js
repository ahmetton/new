// WP EDU Theme — responsive.js
// يضيف زر قائمة الجوال ديناميكياً إن لم يكن موجوداً، ويتحكم بعرض/إخفاء قائمة الـ nav.
// مكتوب ضمن IIFE لتجنّب تسرّب متغيرات للـ global scope.

(function(window, document){
  'use strict';

  function qs(sel, ctx){ return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx){ return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  document.addEventListener('DOMContentLoaded', function(){

    var header = qs('.site-header .site-container') || qs('.site-header');
    var nav = qs('.site-nav');

    if (!nav || !header) return;

    // إذا لم يوجد زر القوائم، أنشئه
    var btn = qs('.mobile-menu-button');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mobile-menu-button';
      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-controls','wpedu-mobile-nav');
      btn.innerHTML = '&#9776; القائمة';
      // أضف الزر في بداية الهيدر يميناً (RTL)
      header.insertBefore(btn, header.firstChild);
    }

    // عين ID للقائمة إن لم تكن
    var ul = nav.querySelector('ul');
    if (!ul) {
      ul = document.createElement('ul');
      nav.appendChild(ul);
    }
    ul.id = ul.id || 'wpedu-mobile-nav';

    // Toggle function
    function toggleMenu(e){
      var isShown = ul.classList.contains('show');
      if (isShown) {
        ul.classList.remove('show');
        btn.setAttribute('aria-expanded','false');
      } else {
        ul.classList.add('show');
        btn.setAttribute('aria-expanded','true');
      }
    }

    btn.addEventListener('click', function(e){
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking outside
    document.addEventListener('click', function(ev){
      var target = ev.target;
      if (!ul.contains(target) && target !== btn) {
        if (ul.classList.contains('show')) {
          ul.classList.remove('show');
          btn.setAttribute('aria-expanded','false');
        }
      }
    });

    // Close on ESC
    document.addEventListener('keydown', function(ev){
      if (ev.key === 'Escape' || ev.key === 'Esc') {
        if (ul.classList.contains('show')) {
          ul.classList.remove('show');
          btn.setAttribute('aria-expanded','false');
        }
      }
    });

    // تحسين: اضف خصائص aria لكل الروابط داخل القائمة
    qsa('.site-nav ul li a').forEach(function(a){
      a.setAttribute('role','menuitem');
    });
    ul.setAttribute('role','menu');

    // Small enhancement: make lesson lists collapsible on mobile
    qsa('.lesson-list').forEach(function(list){
      if (window.innerWidth <= 768) {
        qsa('li', list).forEach(function(li){
          var title = li.querySelector('a') || li.querySelector('h4') || li.querySelector('strong');
          if (!title) return;
          // create toggle button if not exists
          var headerDiv = document.createElement('div');
          headerDiv.style.width = '100%';
          headerDiv.style.display = 'flex';
          headerDiv.style.justifyContent = 'space-between';
          headerDiv.style.alignItems = 'center';
          var btnSmall = document.createElement('button');
          btnSmall.type = 'button';
          btnSmall.className = 'mobile-lesson-toggle';
          btnSmall.style.background = 'transparent';
          btnSmall.style.border = '0';
          btnSmall.style.color = 'var(--primary)';
          btnSmall.style.fontWeight = '700';
          btnSmall.textContent = 'عرض';
          // wrap title
          var titleWrap = document.createElement('div');
          // move existing title into titleWrap
          titleWrap.appendChild(title.cloneNode(true));
          // replace original
          li.insertBefore(headerDiv, li.firstChild);
          headerDiv.appendChild(titleWrap);
          headerDiv.appendChild(btnSmall);
          // content = remaining children except headerDiv
          var content = document.createElement('div');
          // move other nodes into content
          while (li.childNodes.length > 1) {
            var node = li.childNodes[1];
            content.appendChild(node);
          }
          content.style.display = 'none';
          li.appendChild(content);

          btnSmall.addEventListener('click', function(){
            var shown = content.style.display === 'block';
            content.style.display = shown ? 'none' : 'block';
            btnSmall.textContent = shown ? 'عرض' : 'إخفاء';
          });
        });
      }
    });

  });
})(window, document);