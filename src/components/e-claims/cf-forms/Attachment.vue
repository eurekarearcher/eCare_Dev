<template>
    <div class="my-5 ">
       <h1>{{selected_attachment ? selected_attachment : $route.query.type}}</h1>
       <v-tabs v-model="tab" v-if="$route.query.type === 'Surgical Procedure'"> 
           <v-tab v-for="(attach,i) in surgical" :key="i">{{attach.title}}</v-tab>
            <v-tabs-items v-model="tab">
                <v-tab-item v-for="(item,i) in surgical" :key="i">
                    <v-card flat>
                    <v-card-text>{{item.title}}</v-card-text>
                    <v-skeleton-loader v-show="surgical_loader != false && timeout == true" class="mx-auto" max-width="1200px" type="image" ></v-skeleton-loader>
                    <embed  v-show="surgical_loader == false" :src="item.src" key="surgical_key" width="1200px" height="600px" />
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-tabs>

        <v-tabs v-model="tab" v-if="$route.query.type === 'Drugs and Medicine'"> 
           <v-tab v-for="(attach,i) in medicine" :key="i">{{attach.title}}</v-tab>
            <v-tabs-items v-model="tab">
                <v-tab-item v-for="(item,i) in medicine" :key="i">
                    <v-card flat>
                    <v-card-text>{{ item.title }}</v-card-text>
                    <v-skeleton-loader v-show="medicine_loader != false && timeout == true" class="mx-auto" max-width="1200px" type="image" ></v-skeleton-loader>
                    <embed v-show="medicine_loader == false" :src="item.src" key="drugs_med_key" width="1200px" height="600px" />
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-tabs>


         <v-tabs v-model="tab" v-if="$route.query.type === 'Pertinent Laboratory'"> 
           <v-tab v-for="(attach,i) in pertinent" :key="i">{{attach.title}}</v-tab>
            <v-tabs-items v-model="tab">
                <v-tab-item v-for="(item,i) in pertinent" :key="i">
                    <v-card flat>
                    <v-card-text>{{ item.title }}</v-card-text>
                    <v-skeleton-loader v-show="pertinent_loader != false && timeout == true" class="mx-auto" max-width="1200px" type="image" ></v-skeleton-loader>
                    <embed v-show="pertinent_loader == false" :src="item.src" key="pertinent_key"  width="1200px" height="600px" />
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-tabs>


        <v-tabs v-model="tab" v-if="$route.query.type === 'Additional Attachments'"> 
           <v-tab v-for="(attach,i) in additional" :key="i">{{attach.title}}</v-tab>
            <v-tabs-items v-model="tab">
                <v-tab-item v-for="(item,i) in additional" :key="i">
                    <v-card flat>
                    <v-card-text>{{item.title}}</v-card-text>
                    <v-skeleton-loader v-show="additional_loader != false && timeout == true" class="mx-auto" max-width="1200px" type="image" ></v-skeleton-loader>
                    <embed v-show="additional_loader == false" :src="item.src" key="additional_key" width="1200px" height="600px" />
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-tabs>
    </div>
</template>

<script>

export default {
    props:["selected_attachment","additional","medicine","pertinent","surgical"],
    data:()=>({
        tab:null,
        loader:true,
        surgical_loader:true,
        medicine_loader:true,
        pertinent_loader:true,
        additional_loader:true
    }),
    created(){
         if(Object.keys(this.$route.query).length === 0){
            if(sessionStorage.getItem('eligibility_status') === 'Eligible'){
                this.$router.push('/view-forms-pdf/pbef')
            }else{
                this.$router.push('/view-forms-pdf/cf2')
            }
        }else{
            if(this.$route.query.type !== 'Surgical Procedure' && this.$route.query.type !== 'Drugs and Medicine' && this.$route.query.type !== 'Pertinent Laboratory' && this.$route.query.type !== 'Additional Attachments'){
                if(sessionStorage.getItem('eligibility_status') === 'Eligible'){      
                    this.$router.push('/view-forms-pdf/pbef')
                }else{             
                    this.$router.push('/view-forms-pdf/cf2')
                }
            }else{
              if((this.$route.query.type === 'Surgical Procedure' && this.surgical.length === 0) || (this.$route.query.type === 'Drugs and Medicine' && this.medicine.length === 0) || (this.$route.query.type === 'Pertinent Laboratory' && this.pertinent.length === 0) || (this.$route.query.type === 'Additional Attachments' && this.additional.length === 0)){
                if(sessionStorage.getItem('eligibility_status') === 'Eligible'){      
                        this.$router.push('/view-forms-pdf/pbef')
                }else{             
                        this.$router.push('/view-forms-pdf/cf2')
                }
              }  
            } 
        }
    },

    computed:{
        timeout(){
            return this.timeouts();
        }
    },
    watch:{
        $route (to){
             if(to.query.type !== 'Surgical Procedure' && to.query.type !== 'Drugs and Medicine' && to.query.type !== 'Pertinent Laboratory' && to.query.type !== 'Additional Attachments'){
                if(sessionStorage.getItem('eligibility_status') === 'Eligible'){      
                    this.$router.push('/view-forms-pdf/pbef')
                }else{             
                    this.$router.push('/view-forms-pdf/cf2')
                }
             }else{
                 if((to.query.type === 'Surgical Procedure' && this.surgical.length === 0) || (to.query.type === 'Drugs and Medicine' && this.medicine.length === 0) || (to.query.type === 'Pertinent Laboratory' && this.pertinent.length === 0) || (to.query.type === 'Additional Attachments' && this.additional.length === 0)){
                    if(sessionStorage.getItem('eligibility_status') === 'Eligible'){      
                            this.$router.push('/view-forms-pdf/pbef')
                    }else{             
                            this.$router.push('/view-forms-pdf/cf2')
                    }
                 }
             }
        }
    },
    methods:{
        timeouts(){
             if(this.$route.query.type === 'Surgical Procedure'){
                this.medicine_loader = true
                this.pertinent_loader = true
                this.additional_loader = true
                setTimeout(()=> {this.surgical_loader = false},4000)
             }else if(this.$route.query.type === 'Drugs and Medicine'){
                this.surgical_loader = true
                this.pertinent_loader = true
                this.additional_loader = true
                setTimeout(()=> {this.medicine_loader = false},4000)
             }else if(this.$route.query.type === 'Pertinent Laboratory'){
                this.surgical_loader = true
                this.medicine_loader = true
                this.additional_loader = true
                setTimeout(()=> {this.pertinent_loader = false},4000)
             }else if(this.$route.query.type === 'Additional Attachments'){
                this.surgical_loader = true
                this.pertinent_loader = true
                this.medicine_loader = true
                setTimeout(()=> {this.additional_loader = false},4000)
             }

             return true
        
        },
    },

    
}
</script>