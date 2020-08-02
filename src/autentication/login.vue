<template>
  <div class="container-login">
    <div class="info">
      <div class="rodape-info">
        <p class="title-rodape-info">Rits - Lanchonete Online</p>
        <p class="copyright">
          Todos os direitos reservados / Copyright ©
          <span class="js-year-copy">2020</span>
        </p>
      </div>
    </div>

    <div class="form form-login">
      <div class="background-mobile">
        <div class="content-form reset-text-transform">
          <p class="title-mobile">Rits - Lanchonete Online</p>

          <div>
            <h2 style="color: #fff !important;">Entre com suas credenciais</h2>
            <el-form @submit.native.prevent="onSubmitLogin" :model="dados" ref="dados" label-position="top" class="u-mt-30">
              <el-row :gutter="10">
                <el-col :xs="24" :sm="24" :md="24">
                  <el-form-item prop="username" :rules="[$requiredBlur]" key="username">
                    <el-input id="username" placeholder="Usuário" v-model="dados.username"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="24" :md="24">
                  <el-form-item prop="password" :rules="[$requiredBlur]" key="password">
                    <el-input
                      id="password"
                      placeholder="Senha"
                      type="password"
                      v-model="dados.password"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="24" :md="24" class="u-text-right">
                  <el-button
                    :loading="loading"
                    class="btn-login u-mt-10 btn-acoes"
                    type="primary"
                    native-type="submit"
                    plain
                  >
                    <i class="fas fa-sign-in-alt u-mr-5"></i>
                    ENTRAR
                  </el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div style="text-align: center; margin-top: 100px">
          <img src="/public/img/log-rits.png" />
        </div>
      </div>
    </div>

  </div>
</template>
<script>

export default {
  data() {
    return {
      loading: false,
      logado: false,
      dados: {
        username: "admin@gmail.com",
        password: "123123"
      }
    };
  },
  mounted() {

    sessionStorage.removeItem("tokenAdmin");
  },
  methods: {
    logout() {

      this.logado = false;
      this.$store.commit("logoutAdmin");
    },
    onSubmitLogin() {
      this.$refs.dados.validate(valid => { if (valid) {

          this.loading = true;

          this.$axios.post(`${this.$store.state.baseUrlApi}/oauth/token`, this.dados, this.$store.getters.getHeaderAuthAdmin).then(response => {
              
              this.$store.commit("setTokenAdmin", response.data.access_token);
              sessionStorage.setItem("tokenAdmin", response.data.access_token);
              this.$router.push("admin");

            }).catch(error => {

              try {
                
                this.loading = false;
                
                this.$refs.recaptcha.reset();
                if (error.response.status == "401") {
                  
                  this.$message({ message: "Erro! Usuário não autorizado.", type: "error", duration: 5000 });
                
                } else if (error.response.status == "403") {
                  
                  this.$message({ message: "Erro! Captcha Inválido.", type: "error", duration: 5000 });

                } else if (error.response.status == "429") {
                  
                  this.$message({ message: "Erro! Demasiadas solicitações em curto período de tempo.", type: "error", duration: 5000 });
                
                } else {
                
                  this.$message({ message: "Erro! Não foi possível realizar o login.", type: "error", duration: 5000 });

                }
              } catch (e) {

                this.loading = false;
                this.$message({ message: "Erro! Não foi possível realizar o login.", type: "error", duration: 5000 });
              }
            });
      }});
    }
  }
};
</script>
