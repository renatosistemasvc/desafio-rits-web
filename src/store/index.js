import Vue from 'vue'  
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({  
    state: {
        tokenClient: sessionStorage.getItem("tokenClient"),
        tokenAdmin: sessionStorage.getItem("tokenAdmin"),
        baseUrlApi: process.env.VUE_APP_BASE_URL,
        dialogAutentication: {
          status: false,
          form: 'login'
        },
        user: {
            id: '',
            name: '',
            email: '',
            type: ''
        }
    },
    actions: {
        async getUser(context, type){

          let header = null;

          if(type == 'admin'){

            header = context.getters.getHeaderAuthAdmin;
          
          }else{

            header = context.getters.getHeaderAuthClient;
          }

          let response = await axios.get(`${context.state.baseUrlApi}/api/user/get-user-logged`, header);

          context.commit('setUser', response.data);          
        }        
    },
    mutations: {
        openDialogAutentication(state, value){
          
          state.dialogAutentication = value;
        },
        setTokenClient(state, value){

          sessionStorage.setItem("tokenClient", value);
          state.tokenClient = value;
        },
        setTokenAdmin(state, value){

          sessionStorage.setItem("tokenAdmin", value);
          state.tokenAdmin = value;
        },
        setUser(state, value){

          state.user = value;
        },
        logoutAdmin(state, value){

          router.push('/login');
          state.tokenAdmin = null;
          state.user = { name: '', email: '', type: '' };
          sessionStorage.removeItem('tokenAdmin');                
        },
        logoutCliente(state, value){
              
            router.push('/novo-pedido').catch(()=>{});
            state.tokenClient = null;
            state.user = { name: '', email: '', type: '' };
            sessionStorage.removeItem('tokenClient');                
        },
        throwException(state, value){
        //RECEBE AS EXCEÇÕES

          if(typeof value.response.data.errors !== 'undefined'){

            for(let i in value.response.data.errors){

              for(let j in value.response.data.errors[i]){

                setTimeout(()=>{ 
                  
                  this._vm.$message({ message: value.response.data.errors[i][j], type: 'warning', duration: 5000 });
                  
                }, 100);
              }
            }
                          
          }else{

            this._vm.$message({ message: 'Ops.. algo deu errado.', type: 'warning', duration: 5000 });
          }
                        
        }
    },
    getters: {   
        getHeaderAuthClient: state => {

          let options = {            
            headers : {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${state.tokenClient}`
            }           
          }
          return options;
        },
        getHeaderAuthAdmin: state => {

          let options = {            
            headers : {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${state.tokenAdmin}`
            }           
          }
          return options;
        }
    }
})