// سلوكيات الواجهة الأساسية (سجل، تسجيل تسليم واجبات، ajax)
jQuery(function($){
    // مثال: إرسال طلب التسجيل عبر AJAX (إذا استخدمنا الطريقة غير الصفحة)
    $(document).on('submit','form[action*="admin-ajax.php"]', function(e){
        var $f = $(this);
        if ( $f.find('input[name="action"]').val() === 'wpedu_enroll' ) {
            e.preventDefault();
            $.post($f.attr('action'), $f.serialize(), function(res){
                if ( res.success ) { location.reload(); } else { alert(res.data || 'حدث خطأ'); }
            });
        }
    });
});