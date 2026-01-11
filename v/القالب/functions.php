<?php
// functions.php — إعدادات الثيم وخيارات التخصيص، وتحميل ملفات الإضافة إن وُجدت.
if ( ! defined( 'WPINC' ) ) { die; }

function wpedu_theme_setup() {
    load_theme_textdomain( 'wp-edu-theme', get_template_directory() . '/languages' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_image_size( 'course-thumb', 640, 360, true );
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption' ) );
}
add_action( 'after_setup_theme', 'wpedu_theme_setup' );

// Helper: إضافة خاصية defer لسكربت محدد (آمنة لإعادة الاستخدام)
if ( ! function_exists( 'wpedu_add_defer_attribute' ) ) {
    function wpedu_add_defer_attribute( $tag, $handle ) {
        if ( 'wpedu-main' === $handle ) {
            return str_replace( ' src', ' defer src', $tag );
        }
        return $tag;
    }
}

// دالة تحميل ملفات الثيم وملفات التجاوب
function wpedu_enqueue_assets() {
    $theme_dir = get_template_directory();           // مسار الملفات على الخادم
    $theme_uri = get_template_directory_uri();       // URI للوصول للملفات عبر المتصفح

    // main.css
    if ( file_exists( $theme_dir . '/assets/css/main.css' ) ) {
        wp_register_style( 'wpedu-main', $theme_uri . '/assets/css/main.css', array(), '1.0.0' );
        wp_enqueue_style( 'wpedu-main' );
    }

    // rtl.css (اختياري)
    if ( is_rtl() && file_exists( $theme_dir . '/rtl.css' ) ) {
        wp_register_style( 'wpedu-rtl', $theme_uri . '/rtl.css', array( 'wpedu-main' ), '1.0.0' );
        wp_enqueue_style( 'wpedu-rtl' );
    }

    // fallback إلى style.css إذا لم يُحمّل main.css
    if ( ! wp_style_is( 'wpedu-main', 'enqueued' ) ) {
        wp_enqueue_style( 'theme-style', get_stylesheet_uri() );
    }

    // main.js
    if ( file_exists( $theme_dir . '/assets/js/main.js' ) ) {
        wp_register_script( 'wpedu-main', $theme_uri . '/assets/js/main.js', array( 'jquery' ), '1.0.0', true );
        wp_enqueue_script( 'wpedu-main' );

        // أضف defer عبر دالة مسمّاة (آمنة)
        if ( ! has_filter( 'script_loader_tag', 'wpedu_add_defer_attribute' ) ) {
            add_filter( 'script_loader_tag', 'wpedu_add_defer_attribute', 10, 2 );
        }
    }

    // --- responsive.css و responsive.js إن وُجدا ---
    if ( file_exists( $theme_dir . '/assets/css/responsive.css' ) ) {
        wp_register_style( 'wpedu-responsive', $theme_uri . '/assets/css/responsive.css', array( 'wpedu-main' ), '1.0.0' );
        wp_enqueue_style( 'wpedu-responsive' );
    }

    // لجلب responsive.js نتحقق من تسجيل wpedu-main حتى لا يكون الاعتماد غير موجود
    $responsive_deps = array( 'jquery' );
    if ( wp_script_is( 'wpedu-main', 'registered' ) ) {
        $responsive_deps[] = 'wpedu-main';
    }

    if ( file_exists( $theme_dir . '/assets/js/responsive.js' ) ) {
        wp_register_script( 'wpedu-responsive', $theme_uri . '/assets/js/responsive.js', $responsive_deps, '1.0.0', true );
        wp_enqueue_script( 'wpedu-responsive' );
    }
}
add_action( 'wp_enqueue_scripts', 'wpedu_enqueue_assets' );

// تخصيص إعدادات الثيم (Customizer)
function wpedu_customize_register( $wp_customize ) {
    $wp_customize->add_section('wpedu_identity', array('title'=>'هوية الموقع','priority'=>1));
    $wp_customize->add_setting('wpedu_logo');
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'wpedu_logo', array('label'=>'شعار الموقع','section'=>'wpedu_identity','settings'=>'wpedu_logo') ) );
    // إعداد اللون مع تمرير مصفوفة ضبط صحيحة
    $wp_customize->add_setting('wpedu_primary_color', array(
        'default' => '#0a6ebd',
        'sanitize_callback' => 'sanitize_hex_color',
    ));
    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'wpedu_primary_color_control', array(
        'label'    => 'اللون الأساسي',
        'section'  => 'wpedu_identity',
        'settings' => 'wpedu_primary_color',
    ) ) );
}
add_action( 'customize_register', 'wpedu_customize_register' );

// تضمين قوالب مخصصة للثيم
function wpedu_get_template_part( $slug, $name = null ) {
    $file = get_template_directory() . "/templates/{$slug}.php";
    if ( file_exists( $file ) ) { include $file; }
}

// دعم Lazy Loading لصور المقالات
add_filter('wp_get_attachment_image_attributes', function($attr, $attachment, $size) {
    $attr['loading'] = 'lazy';
    return $attr;
}, 10, 3);