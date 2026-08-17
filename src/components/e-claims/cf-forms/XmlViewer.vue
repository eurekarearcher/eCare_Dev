<template>
    <div class="my-1" style="width:100%;">
        <div class="tabs-header">
            <v-tabs v-model="tab" class="tabs-left">
                <v-tab v-for="(attach, i) in view_xml_forms" :key="i">{{ attach.title }}</v-tab>
            </v-tabs>
            <v-spacer></v-spacer>
            <v-btn v-if="view_xml_forms[tab]" @click="encryptedFileDownload(view_xml_forms[tab].file_name)" small color="primary">Download Encrypted File</v-btn>
        </div>

        <v-tabs-items v-model="tab">
            <v-tab-item v-for="(item, i) in view_xml_forms" :key="i">
                <v-card flat>
                    <v-skeleton-loader v-show="view_forms_loader && timeout" class="mx-auto" max-width="1200px" type="image"></v-skeleton-loader>
                    <pre class="xml-viewer ma-5 pa-5" v-html="highlightXml(item.src)"></pre>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
export default {
    props:["view_xml_forms"],
    data:()=>({
        tab: null,
        view_forms_loader: true,
        timeout: false
    }),

    methods:{
        async encryptedFileDownload(file_name) {
            const timestamp = btoa(Date.now().toString())

            let response = await this.$services.encryptedFileDownload({
                file: file_name,
                pc: this.$store.state.prv_data.provider_code,
                pf: 'xml',
                t: timestamp
            })

            if (response.error) return

            const url = window.URL.createObjectURL(response.data)

            const link = document.createElement('a')
            link.href = url
            link.download = file_name

            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        },

        formatXml(xml) {
            const reg = /(>)(<)(\/*)/g
            let formatted = ''
            let pad = 0

            xml = xml.replace(reg, '$1\r\n$2$3')
            xml.split('\r\n').forEach(node => {
                let indent = 0

                if (node.match(/^<\/\w/)) {
                    if (pad) pad--
                } else if (node.match(/^<\w([^>]*[^/])?>.*$/)) {
                    indent = 1
                }

                formatted += new Array(pad + 1).join('    ') + node + '\r\n'
                pad += indent
            })

            return formatted
        },

        highlightXml(xml) {
            if (!xml) return ''

            xml = this.formatXml(xml)
            xml = xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            xml = xml.replace(/&lt;(\/?)([\w:-]+)(.*?)&gt;/g, (match, slash, tagName, attrs) => {
                attrs = attrs.replace(/([\w:-]+)="([^"]*)"/g,'<span class="xml-attr">$1</span>=<span class="xml-value">"$2"</span>'
                )
                return `&lt;${slash}<span class="xml-tag">${tagName}</span>${attrs}&gt;`
            })

            return xml
        }
    }
}
</script>

<style>
.tabs-header {
    display: flex;
    align-items: center;
    width: 82%;
}

.tabs-left {
    flex: 0 0 auto;
}

.xml-tag {
    color: #1d83d7;
    font-weight: bold;
}

.xml-attr {
    color: #e83838;
}

.xml-value {
    color: #ff4a03;
}

.xml-viewer {
    padding: 20px;
    border-radius: 6px;
    white-space: pre-wrap;
    font-family: Consolas, monospace;
}
</style>