<template>
  <div id="search-box">
    <label for="area">地方：</label>
    <select id="area" v-model="selectArea">
      <option value="kanto">カントー</option>
      <option value="johto">ジョウト</option>
      <option value="hohen">ホウエン</option>
      <option value="sinnoh">シンオウ</option>
      <option value="karos">カロス</option>
      <option value="alola">アローラ</option>
    </select>

    <label for="language">Language:</label>
    <select id="language" v-model="selectLocal">
      <option value="JP">日本</option>
      <option value="EN">英語</option>
      <option value="KO">韓国</option>
      <option value="FR">フランス</option>
      <option value="DE">ドイツ</option>
      <option value="ES">スペイン</option>
      <option value="IT">イタリア</option>
    </select>

    <input type="checkbox" id="toggle-check" />
    <label id="toggle-label" for="toggle-check">検索▼</label>
    <div id="toggle-content">

      <label for="word">ずかんNo または なまえ(英語のみ)：</label>
      <input type="text" id="word" v-model="inputWord">

      <label for="type">タイプ：</label>
      <select id="type" v-model="selectType">
        <option value="all">すべて</option>
        <option value=1>ノーマル</option>
        <option value=2>かくとう</option>
        <option value=3>ひこう</option>
        <option value=4>どく</option>
        <option value=5>じめん</option>
        <option value=6>いわ</option>
        <option value=7>むし</option>
        <option value=8>ゴースト</option>
        <option value=9>はがね</option>
        <option value=10>ほのお</option>
        <option value=11>みず</option>
        <option value=12>くさ</option>
        <option value=13>でんき</option>
        <option value=14>エスパー</option>
        <option value=15>こおり</option>
        <option value=16>ドラゴン</option>
        <option value=17>あく</option>
        <option value=18>フェアリー</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    area: String,
    local: String,
    word: String,
    type: String,
  },
  computed: {
    selectArea: {
      get() {
        return this.area
      },
      set(area) {
        this.$emit('update:area', area)
      }
    },
    selectLocal: {
      get() {
        return this.local
      },
      set(local) {
        this.$emit('update:local', local)
      }
    },
    inputWord: {
      get() {
        return this.word
      },
      set(word) {
        this.$emit('update:word', word)
      }
    },
    selectType: {
      get() {
        return this.type
      },
      set(type) {
        this.$emit('update:type', type)
      }
    },
  }
}
</script>

<style scoped>
#search-box{
  position: fixed;
  background: #0e8fa1;
  color: #fff;
  top: 0;
  left: 0;
  margin: 0;
  padding: 10px;
  width: 100%;
  height: 20px;
}

#toggle-check{
  display: none;
}

#toggle-label{
  float: right;
  margin-right: 10px;
}

#toggle-content {
  background: #F4F5F7;
  color: #000;
  margin-top: 5px;
  border: 1px solid #333;
  height: 0;
width: 100%;
  transition: .5s;
  visibility: hidden;
}
#toggle-check:checked + #toggle-label + #toggle-content{
  height: 40px;
  padding: 10px;
  visibility: visible;
}
</style>