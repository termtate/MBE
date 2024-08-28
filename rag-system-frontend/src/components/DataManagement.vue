<template>
    <div>
      <h2>Data Management</h2>
      <ul>
        <li><router-link to="/add-item">Add Item</router-link></li>
        <li><router-link to="/delete-item">Delete Item</router-link></li>
        <li><router-link to="/get-items">Get Items</router-link></li>
        <li><router-link to="/update-item">Update Item</router-link></li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DataManagement'
  };
  </script>
  
  <style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 10px;
  }
  
  a {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
  }
  
  a:hover {
    color: #0056b3;
  }
  </style>
  