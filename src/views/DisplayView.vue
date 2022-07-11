<script lang="ts" setup>

</script>

<template>
    <div class="display-view">
        display-view
        <div class="block"></div>
    </div>
</template>

<style lang="scss" scoped>
.display-view {
    position: relative;
    width: 100%;
    height: 100%;

    .block {
        width: 50px;
        height: 50px;
        animation: shiny 1s infinite linear;

        @keyframes shiny {
            0% {
                background-image: linear-gradient(90deg,
                    #ccc0 0%,
                    #ccc 100%);
            }
            10% {
                background-image: linear-gradient(90deg,
                    #ccc 0%,
                    #ccc0 10%,
                    #ccc 100%);
            }
            20% {
                background-image: linear-gradient(90deg,
                    #ccc 0%,
                    #ccc0 20%,
                    #ccc 100%);
            }
            30% {
                background-image: linear-gradient(90deg,
                    #ccc 0%,
                    #ccc0 30%,
                    #ccc 100%);
            }
            40% {
                background-image: linear-gradient(90deg,
                    #ccc 0%,
                    #ccc0 40%,
                    #ccc 100%);
            }
            50% {
                background-image: linear-gradient(90deg,
                    #ccc 0%,
                    #ccc0 50%,
                    #ccc 100%);
            }
            60% {
                background-image: linear-gradient(90deg,
                    #ccc 0%,
                    #ccc0 60%,
                    #ccc 100%);
            }
            70% {
                background-image: linear-gradient(90deg,
                    #ccc 0%,
                    #ccc0 70%,
                    #ccc 100%);
            }
            80% {
                background-image: linear-gradient(90deg,
                    #ccc 0%,
                    #ccc0 80%,
                    #ccc 100%);
            }
            90% {
                background-image: linear-gradient(90deg,
                    #ccc 0%,
                    #ccc0 90%,
                    #ccc 100%);
            }
            100% {
                background-image: linear-gradient(90deg,
                    #ccc 0%,
                    #ccc0 100%);
            }
        }
    }
}
</style>