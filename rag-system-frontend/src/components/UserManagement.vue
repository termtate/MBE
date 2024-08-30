<template>
  <div>
    <!-- 页面背景 -->
    <div class="page-background"></div>

    <!-- 内容容器 -->
    <div class="user-management">
      <!-- 标题和图标 -->
      <div class="header">
        <h2>User Management</h2>
      </div>

      <!-- 搜索框和按钮 -->
      <div class="search-bar">
        <el-input v-model="searchQuery" placeholder="请输入Username" clearable class="search-input" />
        <el-button type="primary" @click="searchUsers">Search</el-button>
      </div>

      <!-- 用户表格 -->
      <el-table v-if="paginatedUsers.length > 0" :data="paginatedUsers" stripe style="width: 100%; margin: 20px 0;" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="Username"></el-table-column>
        <el-table-column prop="role" label="Role"></el-table-column>
        <el-table-column label="Management">
          <template #default="scope">
            <el-dropdown trigger="click" @command="handleCommand(scope.row, $event)">
              <el-button type="text" size="small">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template v-slot:dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="changeRole">修改角色</el-dropdown-item>
                  <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                  <el-dropdown-item command="deleteUser">删除用户</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <p v-else>没有找到用户。</p>

      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="10"
        :total="filteredUsers.length"
        v-model:currentPage="currentPage"
        class="pagination"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      users: []  // 初始用户数据为空数组
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * 10;
      const end = start + 10;
      return this.filteredUsers.slice(start, end);
    }
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
        console.error("获取用户数据时出错:", error);
      }
    },
    searchUsers() {
      this.currentPage = 1;
    },
    async handleCommand(row, command) {
      switch (command) {
        case 'changeRole':
          await this.changeRole(row.id);
          break;
        case 'changePassword':
          await this.changePassword(row.id);
          break;
        case 'deleteUser':
          await this.deleteUser(row.id);
          break;
      }
    },
    async changeRole(userId) {
      const newRole = prompt("请输入新角色 (user/admin):");
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
          console.error("修改角色时出错:", error);
        }
      }
    },
    async changePassword(userId) {
      const newPassword = prompt("请输入新密码:");
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
          alert("密码已更新！");
        } catch (error) {
          console.error("修改密码时出错:", error);
        }
      }
    },
    async deleteUser(userId) {
      if (confirm("确定要删除此用户吗？")) {
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
          console.error("删除用户时出错:", error);
        }
      }
    }
  },
  mounted() {
    this.fetchUsers();  // 组件加载时获取用户数据
  }
};
</script>

<style scoped>
/* 使用一个背景覆盖整个页面 */
.page-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #444444; /* 灰色背景 */
  z-index: -1; /* 使背景在所有内容的后面 */
}

/* 调整 .user-management 的样式 */
.user-management {
  padding: 40px;
  border-radius: 20px;
  background-color: transparent; /* 设置白色背景 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 900px; /* 限制最大宽度 */
  min-height: 80vh; /* 确保容器有足够的高度 */
  box-sizing: border-box;
  margin: 40px auto;
  z-index: 1; /* 确保内容在背景前面 */
}

/* 标题样式 */
.header h2 {
  font-size: 36px;
  color: #333;
  margin-bottom: 40px;
  margin-top: -30px;
  text-shadow: -8px 8px 5px rgb(255, 255, 255); /* 标题阴影效果 */
}

/* 搜索栏样式 */
.search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  width: 50%;
  background-color: #f0f0f0; /* 背景色 */
  padding: 10px 20px; /* 内边距 */
  border-radius: 25px; /* 圆角 */
  box-shadow: -20px 20px 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  transition: box-shadow 0.3s ease, transform 0.3s ease; /* 过渡效果 */
}

.search-bar:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* hover 时的阴影 */
  transform: translateY(-2px); /* hover 时的轻微位移 */
}

.search-bar input {
  width: 100%;
  padding: 10px 15px; /* 输入框的内边距 */
  border: none;
  border-radius: 20px; /* 输入框的圆角 */
  outline: none;
  font-size: 16px;
}

.search-bar button {
  background-color: #007bff; /* 按钮背景色 */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}

.search-bar button:hover {
  background-color: #0056b3; /* 按钮 hover 时的背景色 */
}

/* 表格样式 */
.el-table {
  background-color: white;
  border-radius: 10px;
  box-shadow: -20px 20px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  transition: box-shadow 0.3s ease, transform 0.3s ease; /* 过渡效果 */
}

.el-table:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* hover 时的阴影 */
  transform: translateY(-2px); /* hover 时的轻微位移 */
}

.el-table th {
  background-color: #f0f0f0;
  color: #333;
}

/* 分页组件样式 */
.pagination {
  margin-top: 20px;
  z-index: 2; /* 确保分页按钮不被遮挡 */
  display: flex;
  justify-content: center; /* 居中分页 */
  list-style: none;
  padding: 0;
  box-shadow: -20px 20px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease; /* 过渡效果 */
}

.pagination:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* hover 时的阴影 */
  transform: translateY(-2px); /* hover 时的轻微位移 */
}

.pagination li {
  margin: 0 5px;
}

.pagination li a {
  display: inline-block;
  padding: 10px 15px;
  border: 1px solid #ddd; /* 边框颜色 */
  border-radius: 5px; /* 圆角 */
  background-color: #f8f9fa; /* 背景色 */
  color: #007bff; /* 文字颜色 */
  text-decoration: none; /* 移除下划线 */
  transition: background-color 0.3s ease, color 0.3s ease; /* 平滑过渡效果 */
}

.pagination li a:hover {
  background-color: #007bff; /* 悬停时背景色 */
  color: #fff; /* 悬停时文字颜色 */
}

.pagination li.active a {
  background-color: #007bff; /* 当前页的背景色 */
  color: #fff; /* 当前页的文字颜色 */
  border-color: #007bff; /* 当前页的边框颜色 */
  cursor: default; /* 当前页的鼠标样式 */
}

.pagination li.disabled a {
  color: #ddd; /* 禁用状态文字颜色 */
  cursor: not-allowed; /* 禁用状态鼠标样式 */
  background-color: #f8f9fa; /* 禁用状态背景色 */
  border-color: #ddd; /* 禁用状态边框颜色 */
}

</style>
