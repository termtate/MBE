<template>
  <div class="container">
    <el-card class="box-card">
      <h2>Knowledge Base Management</h2>

      <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
        <!-- Add Item Tab -->
        <el-tab-pane label="Add Item" name="add-item">
          <transition name="fade">
            <div v-if="activeTab === 'add-item'" class="form-container">
              <el-input
                v-model="formData.addData"
                placeholder="Enter data..."
                type="textarea"
                rows="3"
                resize="none"
              />
              <el-input
                v-model="formData.addEmbedding"
                placeholder="Enter embedding (optional, comma separated)"
              />
              <el-button type="primary" @click="addItem">Add Item</el-button>
            </div>
          </transition>
        </el-tab-pane>

        <!-- Search Items Tab (with inline Edit and Update) -->
        <el-tab-pane label="Search Items" name="search-items">
          <transition name="fade">
            <div v-if="activeTab === 'search-items'" class="form-container">
              <el-input
                v-model="formData.searchKeyword"
                placeholder="Enter keyword..."
              />
              <el-button type="primary" @click="fetchItems">Search</el-button>

              <el-table :data="items" style="width: 100%; margin-top: 20px">
                <el-table-column prop="id" label="ID" width="100" />
                <el-table-column label="Data">
                  <template #default="scope">
                    <el-input
                      v-model="scope.row.data"
                      placeholder="Edit data..."
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Embedding">
                  <template #default="scope">
                    <el-input
                      v-model="scope.row.embedding"
                      placeholder="Edit embedding..."
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Actions" width="200">
                  <template #default="scope">
                    <el-button type="primary" @click="updateItem(scope.row)">Update</el-button>
                    <el-button type="danger" @click="deleteItem(scope.row.id)">Delete</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </transition>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'add-item',
      formData: {
        addData: '',
        addEmbedding: '',
        searchKeyword: ''
      },
      items: [] // 搜索结果
    };
  },
  methods: {
    handleTabClick(tab) {
      console.log("Switched to tab:", tab.name);
    },
    async addItem() {
      if (!this.formData.addData.trim()) {
        this.$message.error('Data field cannot be empty.');
        return;
      }

      // 计算最小可用 ID
      const existingIds = this.items.map(item => item.id).sort((a, b) => a - b);
      let newId = 1;
      for (let i = 1; i <= existingIds.length + 1; i++) {
        if (!existingIds.includes(i)) {
          newId = i;
          break;
        }
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/knowledge_base', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            id: newId,
            data: this.formData.addData,
            embedding: this.formData.addEmbedding
              ? this.formData.addEmbedding.split(',').map(Number)
              : null
          })
        });

        if (response.ok) {
          this.$message.success('Item added successfully!');
          this.formData.addData = '';
          this.formData.addEmbedding = '';
          this.fetchItems(); // 添加后刷新数据
        } else {
          this.$message.error('Failed to add item');
        }
      } catch (error) {
        this.$message.error('Error adding item');
      }
    },
    async fetchItems() {
      if (!this.formData.searchKeyword.trim()) {
        this.$message.error('Keyword field cannot be empty.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/knowledge_base?keyword=${encodeURIComponent(this.formData.searchKeyword)}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          this.items = await response.json();
        } else {
          this.$message.error('Failed to fetch items');
        }
      } catch (error) {
        this.$message.error('Error fetching items');
      }
    },
    async updateItem(item) {
      // 验证数据字段是否为空
      if (!item.data.trim()) {
        this.$message.error('Data field cannot be empty.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/knowledge_base/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            data: item.data,
            embedding: item.embedding.split(',').map(Number)
          })
        });

        if (response.ok) {
          this.$message.success('Entry updated successfully!');
        } else {
          this.$message.error('Failed to update item');
        }
      } catch (error) {
        this.$message.error('Error updating item');
      }
    },
    async deleteItem(id) {
      if (!id) {
        this.$message.error('Invalid ID.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/knowledge_base/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          this.$message.success('Entry deleted successfully!');
          this.fetchItems(); // 刷新搜索结果
        } else {
          this.$message.error('Failed to delete item');
        }
      } catch (error) {
        this.$message.error('Error deleting item');
      }
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #444444;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 98vh;
  text-align: center;
  border-radius: 20px;
}

.box-card {
  width: 60%;
  padding: 20px;
  border-radius: 20px;
  opacity: 0.9;
  border-style: groove;
  box-shadow: -8px 8px 10px #000000;
  background-color: #fefefe;
}

h2 {
  color: #000000;
  margin-bottom: 20px;
  margin-top: 20px;
  font-size: 32px;
  text-shadow: -8px 8px 10px #606060;
}

.form-container {
  margin-top: 20px;
}

.el-input {
  margin-bottom: 10px;
}

.el-button {
  width: 100%;
  margin-top: 10px;
}

.el-tabs .el-tab-pane {
  padding: 20px;
}
</style>
