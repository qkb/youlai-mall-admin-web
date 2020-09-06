<template>
  <div class="app-container">
    <!-- 搜索表单::begin -->
    <el-form :inline="true" ref="queryForm" :model="queryParams">
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="success" @click="handleEdit" :disabled="single">修改</el-button>
        <el-button type="danger" @click="handleDelete" :disabled="multiple">删除</el-button>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="queryParams.username" placeholder="用户名"/>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="queryParams.mobile" placeholder="手机号"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="handleResetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索表单::end -->

    <!-- 数据表格::start -->
    <el-table
      id="dataTable"
      ref="multipleTable"
      :data="pageList"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      border>

      <el-table-column
        type="selection"
        min-width="5%">
      </el-table-column>

      <el-table-column
        prop="username"
        label="用户名"
        min-width="10">
      </el-table-column>

      <el-table-column
        prop="nickname"
        label="昵称"
        min-width="10">
      </el-table-column>

      <el-table-column
        prop="mobile"
        label="手机号码"
        min-width="10">
      </el-table-column>

      <el-table-column
        prop="gender"
        label="性别"
        min-width="10">
        <template slot-scope="scope">
          <el-tag>{{ genderDic[scope.row.gender] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="状态"
        min-width="10">
        <template slot-scope="scope">
          <el-tag>{{ statusDic[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="10">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 数据表格::end-->

    <!-- 分页工具条::start -->
    <pagination
      v-show="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="handleQuery"/>
    <!-- 分页工具条::end -->

    <!-- 表单弹窗::start -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      @close="dialog.visible=false"
      top="20vh"
      width="30%">
      <el-form id="dataForm" label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible=false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表单弹窗::end -->
  </div>
</template>

<script>
  import {pageList, detail, add, update, del} from '@/api/admin/user'

  export default {
    data() {
      return {
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        },
        queryParams: {
          username: undefined,
          mobile: undefined
        },
        pageList: [],
        dialog: {
          title: undefined,
          visible: false,
        },
        form: {
          id: undefined,
          username: undefined,
          nickname: undefined,
          gender: undefined,
          mobile: undefined
        },
        rules: {
          username: [
            {
              required: true, message: '请填写用户名', trigger: 'blur'
            }
          ],
          nickname: [
            {
              required: true, message: '请填写昵称', trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true, message: '请填写手机号', trigger: 'blur'
            }
          ]
        },
        genderDic: ['未知', '男', '女'],
        levelDic: ['普通用户', 'VIP用户', '高级VIP用户'],
        statusDic: ['禁用', '可用', '注销']
      }
    },
    created() {
      this.handleQuery()
    },
    methods: {
      handleQuery() {
        this.queryParams.page = this.pagination.page
        this.queryParams.limit = this.pagination.limit
        pageList(this.queryParams).then(response => {
          this.pageList = response.data;
          this.pagination.total = response.total
        })
      },
      handleResetQuery() {
        this.pagination = {
          page: 1,
          limit: 10,
          total: 0
        }
        this.queryParams = {
          serialNo: undefined,
          name: undefined
        };
        this.handleQuery()
      },
      handleRowClick(row) {
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      handleAdd() {
        this.dialog = {
          title: "新增用户",
          visible: true
        }
        this.$nextTick(function () {
          this.$refs["form"].resetFields()
        })
      },
      handleEdit(row) {
        this.dialog = {
          title: "修改用户",
          visible: true
        }
        this.$nextTick(function () {
          this.$refs["form"].resetFields()
        })
        const id = row.id || this.ids
        detail(id).then(response => {
          this.form = response.data
        })
      },
      handleSubmit() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            const id = this.form.id
            if (id != undefined) {
              update(id, this.form).then(() => {
                this.$message.success("修改成功")
                this.dialog.visible = false
                this.handleQuery()
              })
            } else {
              add(this.form).then(() => {
                this.$message.success("新增成功")
                this.dialog.visible = false
                this.handleQuery()
              })
            }
          }
        })
      },
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除选中的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          del(ids).then(() => {
            this.$message.success("删除成功")
            this.handleQuery()
          })
        }).catch(() =>
          this.$message.info("已取消删除")
        )
      }
    }
  }
</script>

<style scoped>

</style>
