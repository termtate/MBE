<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/register">Register</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/protected">Protected</router-link></li>
        <li><router-link to="/add-item">Add Item</router-link></li>
        <li><router-link to="/get-items">Get Items</router-link></li>
        <li><router-link to="/update-item">Update Item</router-link></li>
        <li><router-link to="/delete-item">Delete Item</router-link></li>
      </ul>
    </nav>
    <!-- 路由出口 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 10px;
}
</style>
