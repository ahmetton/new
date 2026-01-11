<?php
// Footer بسيط
?>
</main>
<footer style="background:#fff;border-top:1px solid #eee;padding:18px 0;margin-top:40px;">
    <div class="site-container" style="display:flex;justify-content:space-between;align-items:center;">
        <div>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?></div>
        <div><?php bloginfo('description'); ?></div>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>