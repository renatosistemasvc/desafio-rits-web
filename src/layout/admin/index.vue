<template>
  <div class="aplication">
    <template>
       
      <div v-if="$store.state.user.id">      
          <div class="tarja-header">
            <div class="logo" :style="{'width': ((collapsed || isMobile) ? '60px' : '190px') }">
              <router-link to="/">
                <div v-if="!collapsed && !isMobile" style="display: flex; padding: 5px 15px; color: #fff; font-size: 14px;">                  
                  <img style="width: 80px;" src="/public/img/log-rits.png">                  
                </div>
                <div v-if="collapsed || isMobile"></div>
              </router-link>
            </div>
            <div>
              <div class="btn-hidden-menu" @click="(isMobile) ? (btnHiddenMenu = !btnHiddenMenu) : (btnCollapsed = !btnCollapsed)">
                <i class="fa fa-bars"></i>
              </div>
              <ul class="menu-tarja-right">
                <li class="btn-area-client">
                  <a class="link-area-client" href="/novo-pedido" target="_blank">
                    <div class="item">                  
                        <i class="fas fa-utensils"></i>
                        <span>Área do Cliente</span>                
                    </div>
                  </a>
                </li>
                <li class="imagem-avatar">
                  <div class="item">
                    <el-dropdown trigger="click" @command="clickSubMenu">
                      <span class="el-dropdown-link">
                        <span class="avatar">
                          <img v-if="!$store.state.user.imagem" src="@/assets/img/perfil.jpg">
                        </span>
                      </span>
                      <el-dropdown-menu slot="dropdown" class="menu-sign">
                        <el-dropdown-item>
                          <i class="fa fa-user-circle"></i><span>{{ $store.state.user.name }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="logout" divided>
                          <i class="fas fa-sign-out-alt"></i><span>Sair</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div id="collapsed" :class="{'collapsed' : collapsed}">
            <sidebar-menu :menu="menu" :btnCollapsed="btnCollapsed" :collapsed="collapsed" :isMobile="isMobile" :btnHiddenMenu="btnHiddenMenu" @collapse="onCollapse" @mobile="onMobile"/>
            <div class="sub-tarja-header">
              <h1>{{ $route.meta.title }}</h1>
              <el-breadcrumb style="margin-top: 5px;" separator="/">
                <el-breadcrumb-item v-for="item in $route.meta.breadcrumb" :key="item.name" :to="{ path: item.url }">{{ item.txt }}</el-breadcrumb-item>
              </el-breadcrumb>          
            </div>          
            <router-view/>
          </div>
      </div>

    </template>

    <el-dialog class="ss-loading" top="0" width="200px" :visible.sync="loading" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>
        <div style="text-align: center;">
          <img src="/public/img/loading.gif" />
        </div>
    </el-dialog>

  </div>
</template>
<script>

import SidebarMenu from './menu/SidebarMenu.vue'

export default {
  name: "index",
  data: () => ({
    btnHiddenMenu: true,
    loading: null,
    menu: [
     
      { header: true, title: 'MENU', tipoUser: [] },
      { href: '/admin', title: 'Dashboard', icon: 'fa fa-dashboard', tipoUser: [] },
      { href: '/admin/pedido', title: 'Pedidos', icon: 'fa fa-dashboard', tipoUser: [] },
      { href: '/admin/cliente', title: 'Clientes', icon: 'fa fa-dashboard', tipoUser: [] },
      { href: '/admin/produto', title: 'Produtos', icon: 'fa fa-dashboard', tipoUser: [] },

    ],
    collapsed: false,
    btnCollapsed: false,
    isMobile: false    
  }),
  async mounted(){ 

    this.$store.dispatch('getUser', 'admin');
  },
  methods: {
    onCollapse(val) {
      this.collapsed = val
    },
    onMobile(val) {
      this.isMobile = val
    },
    clickSubMenu(clicado){

      if(clicado){

        if(clicado == 'logout'){

          this.logout();
        }
      }

    },
    logout(){

      this.$store.commit('logoutAdmin');
    }
  },
  created: function(){
   
    window.eventBus.$on('loading', data =>  {
      this.loading = data;
    });

  },
  components: {
    SidebarMenu
  }
};
</script>
