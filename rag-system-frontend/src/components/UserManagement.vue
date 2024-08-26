<template>
    <div>
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="changeRole(user.id)">Change Role</button>
              <button @click="changePassword(user.id)">Change Password</button>
              <button @click="deleteUser(user.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        users: []
      };
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await fetch('/users', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
                });
                const data = await response.json();
                console.log(data); // 打印数据到控制台
                this.users = data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
      },
      async changeRole(userId) {
        const newRole = prompt("Enter new role (user/admin):");
        await fetch(`/users/${userId}/role`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ role: newRole })
        });
        this.fetchUsers();
      },
      async changePassword(userId) {
        const newPassword = prompt("Enter new password:");
        await fetch(`/users/${userId}/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ password: newPassword })
        });
        alert("Password updated!");
      },
      async deleteUser(userId) {
        if (confirm("Are you sure you want to delete this user?")) {
          await fetch(`/users/${userId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          this.fetchUsers();
        }
      }
    },
    mounted() {
      this.fetchUsers();
    }
  };
  </script>
  