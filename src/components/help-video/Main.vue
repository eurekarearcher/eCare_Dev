<template>
    <div>
        <!-- Help Icon -->
        <v-row class="justify-end help-icon-container" dense>
            <v-icon 
                v-if="this.$store.state.usr_credentials.user_settings.display_help === '1' || this.$store.state.usr_credentials.user_settings.display_help === 1" 
                class="help-icon mr-10 d-print-none border-md" 
                color="primary" 
                @click="openDialog" 
                large 
                app 
                inset
                >
                mdi-help-circle-outline
            </v-icon>
        </v-row>
                
        <v-dialog v-model="show_dialog" width="900" persistent class="dialog-parent">
            <v-col cols="12" class="transparent"> 
                    <v-row cols="12" class="justify-end pl-2 pb-3 close-row">
                        <v-btn @click="closeDialog" class="close-icon" icon>
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-row>    
                <v-card>
                    <v-card-text class="pa-0">
                        <div v-if="video_count === 1" class="video-container">
                            <v-responsive aspect-ratio="16/9">
                                <video controls width="100%">
                                    <source :src="Object.values(help_video_url)[0]" type="video/mp4">
                                </video>
                            </v-responsive>
                        </div>

                        <div v-else>
                            <v-card-title class="font-weight-medium d-flex body-3 pb-0 pt-2 pl-4">
                                <span class="font-weight-bold">Help Videos</span>
                            </v-card-title>
                            <!-- Show list of videos -->
                            <v-list v-if="current_video_index === null">
                                <v-list-item-group class="mt-0 pt-0">
                                    <v-list-item
                                    v-for="(url, index) in help_video_url"
                                    :key="index"
                                    @click="playVideo(index)"
                                    >
                                    <v-card class="video-card" width="100%">
                                        <v-card-title class="font-weight-medium d-flex align-center body-1">
                                            <v-icon left class="mr-2" color="primary">mdi-play-circle</v-icon>
                                            {{ (index).toString().replace(/_/g, ' ') }}
                                        </v-card-title>
                                    </v-card>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>

                            <div v-if="current_video_index !== null">
                                <v-btn class="ml-14" @click="current_video_index = null" icon>
                                    <v-icon>mdi-arrow-left</v-icon>
                                    Back to List
                                </v-btn>
                                <v-responsive aspect-ratio="16/9">
                                    <video controls width="100%">
                                        <source :src="help_video_url[current_video_index]" type="video/mp4">
                                    </video>
                                </v-responsive>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-dialog>
    </div>
</template>

<script>
import help_video_json from "@/reference/help-video.json";

export default {
    props: ['steps'],

    data() {
        return {
            show_dialog: false,
            help_video_json: help_video_json,
            help_video_url: [],
            current_video_index: null
        };
    },

    watch: {
        '$store.state.usr_credentials.user_settings.display_help'(new_value) {
            if (new_value === 1 || new_value === "1") {
                this.getHelpVideo(this.steps);
            }
        },
        steps(new_step) {
            if (this.$store.state.usr_credentials.user_settings.display_help === 1 || this.$store.state.usr_credentials.user_settings.display_help === "1") {
                this.getHelpVideo(new_step);
            }
        },
        $route() {
            if (this.$store.state.usr_credentials.user_settings.display_help === 1 || this.$store.state.usr_credentials.user_settings.display_help === "1") {
                this.getHelpVideo();
            }
        }
    },

    computed:{
        video_count() {
            return Object.keys(this.help_video_url).length;
        }     
    },

    created() {
        if (this.$store.state.usr_credentials.user_settings.display_help === 1 || this.$store.state.usr_credentials.user_settings.display_help === "1") {
            this.getHelpVideo(this.steps);
        }
    },

    methods: {
        openDialog() {
            this.show_dialog = true;
        },

        closeDialog() {
            this.show_dialog = false;
            this.current_video_index = null; // Reset video selection on close
            
            this.$nextTick(() => {
                let videos = document.querySelectorAll('video');
                videos.forEach((video) => {
                    if (!video.paused) {
                        video.pause();
                    }
                });
            });
        },

        async getHelpVideo(step) {
            this.help_video_url = [];
            let route_name = step !== undefined ? step : this.$route.path;
            let payload_data = Object.values(this.help_video_json).find(
                (route) => route.route === route_name
            );

            if (payload_data) {
                let response = await this.$services.getHelpVideo({
                    v_id: payload_data.v_id,
                    module: payload_data.module
                });

                if (response.status === 200) {
                    this.help_video_url = response.data['help-video-url'];
                } else {
                    this.alert = response.error;
                }
            }
        },

        playVideo(index) {
            this.current_video_index = index; 
        }
    }
};
</script>

<style scoped>
.help-icon {
    position: fixed;
    cursor: pointer;
    z-index: 1000;
    margin-top: -120px;
}
.video-card {
  margin: 8px 0;
  transition: transform 0.3s;
  color: #1976d2 !important;
}

.video-card:hover {
  transform: scale(1.02);
}

.v-list, video{
    border-radius:5px !important
}

.close-row{
    width:820px;
}

::v-deep .close-icon{
    cursor: pointer !important;
    z-index: 1100 !important;
    color: #fff !important;
}

::v-deep .close-icon:hover {
    cursor: pointer !important;
}

::v-deep .v-dialog, ::v-deep .dialog_parent{
    position: relative;
    overflow: hidden !important;
    box-shadow: none;
    border-radius: 4px !important;
    padding: 50px !important;
}
</style>
