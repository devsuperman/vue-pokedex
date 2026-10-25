<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink :to="{ name: 'home' }" class="app-header__brand">
        <img src="@/assets/pokeball.svg" alt="" width="28" height="28" />
        <span>Pokédex</span>
      </RouterLink>
      <nav aria-label="Main">
        <RouterLink :to="{ name: 'home' }">Home</RouterLink>
        <RouterLink :to="{ name: 'favorites' }">Favorites</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--color-primary);
  color: #fff;
  box-shadow: var(--shadow-md);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 1.35rem;
  font-weight: 800;
  text-decoration: none;
}

nav {
  display: flex;
  gap: var(--space-2);
}

nav a {
  padding: var(--space-1) var(--space-3);
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
}

nav a:hover {
  background: rgb(255 255 255 / 15%);
}

/* RouterLink adds this class to the link of the current page */
nav a.router-link-exact-active {
  background: #fff;
  color: var(--color-primary);
}
</style>
