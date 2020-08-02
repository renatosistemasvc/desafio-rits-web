<template>
    <div class="page-sale">

        <div class="targe">
            <div class="container">
                <img src="/public/img/log-rits.png"> 
                <div class="btns">
                    <div @click="openAreaAdministrative()" class="btn-painel">Admin</div>
                    <div v-if="!$store.state.tokenClient" @click="openDialogAutentication('register')" class="btn-register">Cadastrar</div>
                    <div v-if="!$store.state.tokenClient" @click="openDialogAutentication('login')" class="btn-login">Login</div>
                    <div v-if="$store.state.tokenClient" @click="openMySales()" class="logout">Meus Pedidos</div>
                    <div v-if="$store.state.tokenClient" @click="logout()" class="logout">Sair</div>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="container">
                <router-view/>
            </div>
        </div>

        <el-dialog :close-on-click-modal="false" :title="(formAuth == 'login') ? 'LOGIN' : 'NOVO CADASTRO'" width="30%" :visible.sync="$store.state.dialogAutentication.status" v-on:close="resetFormAutentication()">
            <div v-if="$store.state.dialogAutentication.status">
                <div v-if="$store.state.dialogAutentication.form == 'login'">                    
                    <h4>Entre com suas credenciais</h4>
                    <el-form @submit.native.prevent="onSubmitLogin" :model="formLogin" ref="formLogin" label-position="top" class="u-mt-10">
                        <el-row :gutter="10">
                            <el-col :xs="24" :sm="24" :md="24">
                                <el-form-item prop="email" :rules="[$requiredBlur]" key="email">
                                    <el-input placeholder="E-mail" v-model="formLogin.email"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :xs="24" :sm="24" :md="24">
                                <el-form-item prop="password" :rules="[$requiredBlur]" key="password">
                                    <el-input placeholder="Senha" type="password" v-model="formLogin.password"></el-input>
                                </el-form-item>
                            </el-col> 
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :xs="24" :sm="8" :md="8">
                                <a @click="openDialogAutentication('register')" class="btn-new-register" href="javascript:void(0)">Não tenho cadastro</a>
                            </el-col>
                            <el-col :xs="24" :sm="16" :md="16" class="u-text-right">
                                <el-button class="btn-login" type="primary" native-type="submit" plain>
                                    <i class="fas fa-sign-in-alt"></i>
                                    ENTRAR
                                </el-button>
                            </el-col> 
                        </el-row>                      
                    </el-form>                    
                </div>
                <div v-if="$store.state.dialogAutentication.form == 'register'">                    
                    <el-form @submit.native.prevent="onSubmitRegister" :model="formRegister" ref="formRegister" label-position="top" class="u-mt-20">
                        <el-row :gutter="10">
                            <el-col :xs="24" :sm="24" :md="24">
                                <el-form-item prop="name" :rules="[$requiredBlur]" key="name">
                                    <el-input placeholder="Seu Nome" v-model="formRegister.name"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :xs="24" :sm="24" :md="24">
                                <el-form-item prop="phone" :rules="[$requiredBlur]" key="phone">
                                    <el-input v-mask="'(##) #########'" placeholder="Telefone" v-model="formRegister.phone"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :xs="24" :sm="24" :md="24">
                                <el-form-item prop="andress" :rules="[$requiredBlur]" key="andress">
                                    <el-input placeholder="Endereço" v-model="formRegister.andress"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :xs="24" :sm="24" :md="24">
                                <el-form-item prop="email" :rules="[$requiredBlur]" key="email">
                                    <el-input placeholder="E-mail" v-model="formRegister.email"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :xs="24" :sm="24" :md="24">
                                <el-form-item prop="password" :rules="[$requiredBlur]" key="password">
                                    <el-input placeholder="Senha" type="password" v-model="formRegister.password"></el-input>
                                </el-form-item>
                            </el-col> 
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :xs="24" :sm="8" :md="8">
                                <a @click="openDialogAutentication('login')" class="btn-new-register" href="javascript:void(0)">Já possuo cadastro</a>
                            </el-col>
                            <el-col :xs="24" :sm="16" :md="16" class="u-text-right">
                                <el-button class="btn-login" type="primary" native-type="submit" plain>
                                    <i class="fas fa-sign-in-alt"></i>
                                    CADASTRO
                                </el-button>
                            </el-col> 
                        </el-row>                      
                    </el-form>                    
                </div>
            </div>
        </el-dialog>
      
    </div>
</template>
<script>

export default {
    data: () => ({
        formAuth: 'login',
        formLogin:{
            email: 'email@gmail.com',
            password: '123123'
        },
        formRegister:{
            name: 'teste',
            phone: '(77) 988045503',
            andress: 'endereço',
            email: 'email@gmail.com',
            password: '123123'
        },
    }),
    mounted(){
        
        if(this.$store.state.tokenClient){

            this.$store.dispatch('getUser', 'client');
        }
    },
    methods:{
        openAreaAdministrative(){

            this.$router.push('/admin');
        },
        openMySales(){

            this.$router.push('/').catch(()=>{});  
        },
        openDialogAutentication(form){

            this.$store.commit('openDialogAutentication', {status: true, form: form });
        },
        logout(){

            this.$store.commit('logoutCliente');
        },
        onSubmitLogin(){

            this.$refs.formLogin.validate((valid) =>{ if(valid){
                
                this.$axios.post(`${this.$store.state.baseUrlApi}/api/user/login-client`, this.formLogin, this.$store.getters.getHeaderAuthClient).then(response => {
                    
                    if(typeof response.data.erro !== 'undefined'){

                        this.$message({ message: response.data.erro, type: 'warning', duration: 5000 });
                                    
                    }else if(typeof response.data.token === 'undefined'){

                        this.$message({ message: 'Não foi possível realizar o login do usuário', type: 'warning', duration: 5000 });
                        
                    }else{

                        this.$store.commit("setTokenClient", response.data.token);
                            
                        this.$store.commit("setUser", {
                            id: response.data.id,
                            name: response.data.name,
                            email: response.data.email,
                            type: response.data.type
                        });
                    
                        this.$store.commit('openDialogAutentication', {status: false, form: 'login' });
                    }
                    
                }).catch((error) => { this.$store.commit('throwException', error) });


            }else{ this.$message({ message: 'Campos obrigatórios não foram preenchidos.', type: 'warning', duration: 5000 }); }});

        },
        onSubmitRegister(){

            this.$refs.formRegister.validate((valid) =>{ if(valid){
                
                this.$axios.post(`${this.$store.state.baseUrlApi}/api/client/store`, this.formRegister, this.$store.getters.getHeaderAuthClient).then(response => {
                
                    if(typeof response.data.erro !== 'undefined'){

                        this.$message({ message: response.data.erro, type: 'warning', duration: 5000 });
                                    
                    }else{

                        this.$store.commit("setTokenClient", response.data.token);
                        
                        this.$store.commit("setUser", {
                            id: response.data.id,
                            name: response.data.name,
                            email: response.data.email,
                            type: response.data.type
                        });
                    
                        this.$store.commit('openDialogAutentication', {status: false, form: 'login' });
                        
                        this.$message({ message: 'Usuário Cadastrado com Sucesso!.', type: 'success', duration: 5000 });
                    }

                }).catch((error) => { this.$store.commit('throwException', error) });


            }else{ this.$message({ message: 'Campos obrigatórios não foram preenchidos.', type: 'warning', duration: 5000 }); }});

        },
        resetFormAutentication(){

            this.formLogin = {
                email: '',
                password: ''
            };

            this.formRegister = {
                name: '',
                phone: '',
                andress: '',
                email: '',
                password: ''
            };
        }
    }
}
</script>
