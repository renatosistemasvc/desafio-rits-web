import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Login from '@/autentication/login'

/* LAYOUT */
const LayoutAdmin = () => import('@/layout/admin')
const LayoutClient = () => import('@/layout/client')

/*** SALES CLIENTS ***/
const SaleClientList = () => import('@/components/sale/client/list')
const SaleClientForm = () => import('@/components/sale/client/form')

/*** HOME ***/
const Home = () => import('@/components/home')

/*** SALES ADMIN ***/
const SaleAdminList = () => import('@/components/sale/admin')

/*** PRODUCTS ***/
const ProductList = () => import('@/components/product/list')
const ProductForm = () => import('@/components/product/form')

/*** CLIENTS ***/
const ClientsList = () => import('@/components/client/list')

const routes = new Router({
  mode: 'history',
  base: '/painel',  
  routes: [

      { path: '/login', component: Login },
      { path: '/', component: LayoutClient,
        children: [
          
          { path: '/', component: SaleClientList, meta: { requiresAuth: true, origin: 'client' } },
          { path: '/novo-pedido', component: SaleClientForm, meta: { requiresAuth: false, origin: 'client' } },
        ]
      },
      { path: '/admin', component: LayoutAdmin,
        children: [

          { path: '/', component: Home, meta: { requiresAuth: true, origin: 'admin', title: "Resumo de Atendimentos", breadcrumb: [{txt: 'dashboard', url: false}] } },
                    
          { path: 'pedido', component: SaleAdminList, meta: { requiresAuth: true, origin: 'admin', title: "Listagem de Pedidos", breadcrumb: [{txt: 'Página Inicial', url: '/'}, {txt: 'listagem de pedidos', url: false}] } },
          
          { path: 'produto', component: ProductList, meta: { requiresAuth: true, origin: 'admin', title: "Listagem de Produtos", breadcrumb: [{txt: 'Página Inicial', url: '/'}, {txt: 'listagem de produtos', url: false}] } },
          { path: 'produto/cadastro', component: ProductForm, meta: { requiresAuth: true, origin: 'admin', title: "Novo Produto", breadcrumb: [{txt: 'Página Inicial', url: '/'}, {txt: 'produtos', url: '../produto'}, {txt: 'novo produto', url: false}] } },
          { path: 'produto/edit/:id', component: ProductForm, meta: { requiresAuth: true, origin: 'admin', title: "Editar Produto", breadcrumb: [{txt: 'Página Inicial', url: '/'}, {txt: 'produtos', url: '../../produto'}, {txt: 'editar produto', url: false}] } },

          { path: 'cliente', component: ClientsList, meta: { requiresAuth: true, origin: 'admin', title: "Listagem de Clientes", breadcrumb: [{txt: 'Página Inicial', url: '/'}, {txt: 'listagem de clientes', url: false}] } },
          
        ],
      }      
  ]
})

routes.beforeEach((to, from, next) => {

  if(to.matched.some(record => record.meta.requiresAuth && record.meta.origin == 'client')) {
     
    if(!sessionStorage.getItem("tokenClient")){
      
      next({ path: '/novo-pedido' });
      return false;
    }    
  }

  if(to.matched.some(record => record.meta.requiresAuth && record.meta.origin == 'admin')) {
     
    if(!sessionStorage.getItem("tokenAdmin")){
      
      next({ path: '/login' });
      return false;
    }    
  }

  next();
})

export default routes
