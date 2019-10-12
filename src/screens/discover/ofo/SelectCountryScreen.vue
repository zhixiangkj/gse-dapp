<template>
  <div class="select_country_screen">
    <ofo-nav-header :fixed="true"/>
    <ul class="country_list">
      <li
        :key="sindex"
        v-for="(section, sindex) in countryList">
        <div class="country_list_section_header">{{section.title}}</div>
        <ul class="country_list_section">
          <li
            class="country_list_section_item"
            :key="index"
            v-for="(item, index) in section.data"
            @click="selected(item, index)"
          >
            <img
              class="national_lag"
              :src="getSrc(item)" />
            <div class="country_name">{{item.name}}</div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import countryList from '../../../assets/js/countryList'
export default {
  name: 'select-country-screen',
  data () {
    return {
      countryList: null
    }
  },
  methods: {
    selected (item) {
      $eventBus.$emit('selectedCountry', item)
      this.$router.back()
    },
    getSrc (country) {
      const code = country ? country.countryCode : ''
      return `../../../../../static/img/ofo/countryList/${code}.imageset/${code}@3x.png`
    },
    getCountryList () {
      const list = []
      for (let i = 0; i < countryList.length; i++) {
        const item = countryList[i]
        const title = item.name.charAt(0)
        if (list.length === 0 || list[list.length - 1].title !== title) {
          list.push({
            title,
            data: [item]
          })
        } else {
          list[list.length - 1].data.push(item)
        }
      }
      return list
    }
  },
  created () {
    // 获取国家列表
    this.countryList = this.getCountryList()
  }
}
</script>

<style lang="less" scoped>
  @import "../../../assets/styles/vars";
  .select_country_screen {
    .country_list{
      /*position: absolute;*/
      /*top: 75px;*/
      /*bottom: 0;*/
      /*width: 100%;*/
      /*margin: auto;*/
      /*overflow: auto;*/
      margin-top: 75px;
      padding: 0 @default-padding;
      .country_list_section_header{
        margin-top: 12px;
        height: 39px;
        line-height: 39px;
        font-size:14px;
        border-bottom: 1px solid #efefef;
      }
      .country_list_section{
        .country_list_section_item{
          height: 52px;
          border-bottom: 1px solid #efefef;
          display: flex;
          align-items: center;
          .national_lag{
            height: 20px;
            width: 28px;
          }
          .country_name{
            margin-left: 12px;
            font-size:16px;
            font-family:SFProText-Medium;
            font-weight:500;
          }
        }
      }
    }
  }
</style>
