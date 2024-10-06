<script>
    import "../app.css";
  </script>
  
<div class="container mx-auto px-4">
  <slot />
</div>

<style>
  :global(.no-scrollbar::-webkit-scrollbar) {
    display: none;
  }
  :global(.no-scrollbar) {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>