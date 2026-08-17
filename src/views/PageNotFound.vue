<template>
    <v-container fill-height justify-center>
            <h1 class="mr-10 blue--text font-weight-light hidden-xs-only" style="font-size:120px">:(</h1>
            <div class="text-center text-sm-left">
                <h1 class="display-2 mb-5">404 - <span >Page Not Found</span></h1>
                <p class="subtitle-1 mb-5" >
                    We can't find the page you're looking for.<br/>
                    Please go back to the homepage
                </p>
                <v-btn color="blue" depressed @click="homepage()" small dark>Go back to Homepage</v-btn>
            </div>
    </v-container>
</template>

<script>
export default {
    methods:{
        homepage(){
            this.$router.replace('/')
        }
    }
}
</script>