export const useScrollAnimation = () => {
  const isVisible = ref(false)
  
  const observeElement = (element: HTMLElement, threshold = 0.1) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          element.classList.add('visible')
          observer.unobserve(element)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    )
    
    observer.observe(element)
    
    return observer
  }
  
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll')
    
    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        observeElement(element)
      }
    })
  }
  
  const addStaggeredAnimation = (container: HTMLElement, delay = 100) => {
    const children = container.querySelectorAll('.stagger-animate')
    
    children.forEach((child, index) => {
      if (child instanceof HTMLElement) {
        child.style.animationDelay = `${index * delay}ms`
        child.classList.add('animate-fade-in-up')
      }
    })
  }
  
  return {
    isVisible,
    observeElement,
    animateOnScroll,
    addStaggeredAnimation
  }
} 