<template>
	<jyf-parser :html="cardInfo.contList" ref="article"></jyf-parser>
</template>

<script>
	export default{
		name:"htmlCardCmp",
		props:[
			"cardInfo"
		]
	}
</script>

<style>
	
</style>
