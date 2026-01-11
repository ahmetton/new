<?php
// Header بسيط ومتوافق RTL مع Customizer
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class('rtl'); ?>>
<header class="site-header">
    <div class="site-container" style="display:flex;align-items:center;justify-content:space-between;">
        <div class="site-logo">
            <?php if ( get_theme_mod('wpedu_logo') ) : ?>
                <a href="<?php echo esc_url(home_url('/')); ?>"><img src="<?php echo esc_url(get_theme_mod('wpedu_logo')); ?>" alt="<?php bloginfo('name'); ?>"></a>
            <?php else: ?>
                <a href="<?php echo esc_url(home_url('/')); ?>"><h2><?php bloginfo('name'); ?></h2></a>
            <?php endif; ?>
        </div>
        <nav class="site-nav">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container' => false,
                'menu_class' => '',
                'items_wrap' => '<ul>%3$s</ul>'
            ));
            ?>
        </nav>
    </div>
</header>
<main class="site-container">