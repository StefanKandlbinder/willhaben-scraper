<template>
    <Transition name="fade" mode="out-in">
        <slot></slot>
    </Transition>
</template>
  
<style>
.fade-enter-active {
    transition: opacity .5s ease-in-out;
}

.fade-leave-active {
    transition: opacity .25s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-leave-from,
.fade-enter-to {
    opacity: 1;
}
</style>