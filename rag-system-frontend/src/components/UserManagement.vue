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
          const token = localStorage.getItem('token');
          const response = await fetch('/users', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.users = await response.json();
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
      async changeRole(userId) {
        const newRole = prompt("Enter new role (user/admin):");
        if (newRole) {
          try {
            const token = localStorage.getItem('token');
            await fetch(`/users/${userId}/role`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ role: newRole })
            });
            this.fetchUsers();
          } catch (error) {
            console.error("Error changing role:", error);
          }
        }
      },
      async changePassword(userId) {
        const newPassword = prompt("Enter new password:");
        if (newPassword) {
          try {
            const token = localStorage.getItem('token');
            await fetch(`/users/${userId}/password`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ password: newPassword })
            });
            alert("Password updated!");
          } catch (error) {
            console.error("Error changing password:", error);
          }
        }
      },
      async deleteUser(userId) {
        if (confirm("Are you sure you want to delete this user?")) {
          try {
            const token = localStorage.getItem('token');
            await fetch(`/users/${userId}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            this.fetchUsers();
          } catch (error) {
            console.error("Error deleting user:", error);
          }
        }
      }
    },
    mounted() {
      this.fetchUsers();
    }
  }
  </script>
  
  <style scoped>S
  body,html {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #d9c3a8; 
  }


  table {
    width: 60%;
    border-collapse: collapse;
    margin-top: 20px;
    margin:0 auto;
    border-radius: 20px;
    color: #9b9191;
  }

  h2 {
    text-align: center;
    margin-bottom: 25px;
    font-size: 42px;
    color: #3a2e2e;
    text-shadow: -8px 8px 5px rgba(108, 108, 108, 0.5);
    margin: 20px auto;
}
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: middle;
    color: rgb(72, 61, 46);
  }
  
  th {
    background-color: #887070;
    border-radius: 20px;
    box-shadow: -10px 15px 5px rgba(0, 0, 0, 0.2);
  }
  
  button {
    margin-right: 5px;
    padding: 5px 10px;
    background-color: #bd771b;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    border-radius: 20px;
    box-shadow: -10px 15px 5px rgba(0, 0, 0, 0.2);
  }
  
  button:hover {
    background-color: #b34500;
  }
  </style>
  