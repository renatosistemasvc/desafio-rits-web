<template>
    <div>
        <el-row class="u-mt-10 u-mb-20">
            <el-col :xs="24" :sm="16" :md="16">
                <el-input size="small" v-model="filtro['name']" placeholder="Pesquisar produto..." @keyup.native.enter="loadingProduct"></el-input>
            </el-col>
            <el-col :xs="24" :sm="8" :md="8" class="u-text-right">
                <router-link to="/admin/produto/cadastro" class="btn-new-register">
                    <el-button size="small" type="primary">NOVO PRODUTO</el-button>
                </router-link>
            </el-col>
        </el-row>
        <div class="container-table">
            <table v-loading="!statusList" class="table table-striped">
                <thead>
                    <tr>
                        <th style="width: 70px;">Cod.</th>
                        <th>Nome</th>
                        <th>Valor</th>
                        <th style="width: 160px;" class="u-text-center">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>R$ {{ formatPrice(item.price) }}</td>
                        <td class="u-text-center acao"> 
                            
                            <router-link :to="'/admin/produto/edit/'+ item.id" class="link-icon" style="color: rgba(0, 0, 0, 0.87) !important;">
                                <el-button type="warning" title="Editar" icon="el-icon-edit" size="mini"></el-button>
                            </router-link>

                            <el-button @click="showInfo(item)" title="Visualizar Detalhes" type="info" size="mini">
                                <i class="fas fa-search"></i>
                            </el-button>

                            <el-button @click="deleteProduct(item.id)" title="Excluir" type="danger" icon="el-icon-delete" size="mini"></el-button>

                        </td>
                    </tr>
                </tbody>
            </table>
            <el-row :gutter="10" v-if="statusList">
                <el-col :xs="24" :sm="12" :md="12">
                    <div class="u-text-left u-mt-10">
                        Mostrando {{ paginate.from }} até {{ paginate.to }} de {{ paginate.qtdItens }} registros encontrados.
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" v-if="paginate.qtdItens > 20">
                    <div class="u-text-right">
                            <el-pagination :current-page='paginate.page' class="u-mt-10" :total="paginate.qtdItens" @current-change="getPagePagination" :page-size="20" background layout="prev, pager, next" small></el-pagination>
                        </div>
                </el-col>
            </el-row>
        </div>

        <el-dialog :close-on-click-modal="false" title="DETALHES DO PRODUTO" width="60%" :visible.sync="dialogInfoProduct">
            <div v-if="dialogInfoProduct">
                
                <div v-if="Object.keys(productSelected).length !== 0">
                    <el-row :gutter="10" class="u-mt-20">
                        <el-col :xs="24" :sm="24" :md="24"> 
                            <dl>
                                <dt>NOME:</dt>
                                <dd>{{ productSelected.name }}</dd>
                            </dl>                            
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="24"> 
                            <dl>
                                <dt>PREÇO:</dt>
                                <dd>{{ productSelected.price }}</dd>
                            </dl>                            
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="24"> 
                            <dl>
                                <dt>DESCRIÇÃO:</dt>
                                <dd>{{ productSelected.description }}</dd>
                            </dl>                            
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :xs="24" class="u-text-right">
                            <el-button size="small" type="danger" @click="dialogInfoProduct = false">FECHAR</el-button>
                        </el-col>
                    </el-row>
                </div>

            </div>
        </el-dialog>

    </div>
</template>
<script>

export default {
    data: () => ({
        dialogInfoProduct: false,
        statusList: false,
        filtro: {
            name: ''
        },
        paginate: {
            page: 1,
            qtdItens: null,
            from: '',
            to: ''
        },
        items: [ ],
        productSelected: {}
    }),
    mounted () {
      this.loadingProduct()
    },
    methods: {
        showInfo(item){

            this.productSelected = item;
            this.dialogInfoProduct = true;
        },
        loadingProduct(){

            this.statusList = false;
            this.items = [];

            this.$axios.post(`${this.$store.state.baseUrlApi}/api/product/getAllPaginate?page=` + this.paginate.page, this.filtro, this.$store.getters.getHeaderAuthAdmin).then(response => {

                this.items = response.data.data;
                this.paginate.qtdItens = response.data.total;
                this.paginate.from = response.data.from;
                this.paginate.to = response.data.to;
                this.statusList = true;

            }).catch((error) => { this.$store.commit('throwException', error); });

        },
        deleteProduct(id){

            this.$msgbox.confirm('Tem certeza que deseja excluir este produto?', 'Atenção', { confirmButtonText: 'Sim', cancelButtonText: 'Não', type: 'warning' }).then(() => {

                window.eventBus.$emit('loading', true);
                    
                this.$axios.delete(`${this.$store.state.baseUrlApi}/api/product/delete/` + id, this.$store.getters.getHeaderAuthAdmin).then(response => {
                            
                    window.eventBus.$emit('loading', false);
                    window.eventBus.$emit('alert', {msg: 'Sucesso! - Operação realizada com Sucesso!', type: 'success'});
                    this.loadingProduct();

                }).catch((error) => { this.$message({ message: 'Ocorreu um erro!.', type: 'warning', duration: 5000 }); });

            }).catch(()=>{});

        },
        getPagePagination(page){
          this.paginate.page = page;
          this.loadingProduct();
        },
        formatPrice(value) {

            if(!value)
                return '-';
            
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
    }
}
</script>