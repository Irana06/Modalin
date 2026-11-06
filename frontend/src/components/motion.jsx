import { useEffect, useRef } from 'react'

/** Marks the element as shown the first time it scrolls into view. */
function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.dataset.shown = ''
        observer.disconnect()
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return ref
}

const delayStyle = (delay) => (delay ? { '--delay': `${delay}ms` } : undefined)

/** Content that rises gently into place as it scrolls into view. */
export function Reveal({ delay, as = 'div', ...props }) {
  const Tag = as
  return <Tag ref={useReveal()} data-reveal="" style={delayStyle(delay)} {...props} />
}

/** A 1px hairline that draws itself from left to right. */
export function Rule({ delay, className = 'bg-line-strong' }) {
  return <div ref={useReveal()} data-rule="" aria-hidden="true" style={delayStyle(delay)} className={`h-px w-full ${className}`} />
}

/** One line of a headline that rises from behind a mask on page load. */
export function MaskLine({ delay = 0, children }) {
  return (
    <span className="line-mask">
      <span style={delayStyle(delay)}>{children}</span>
    </span>
  )
}

/** Fades in on page load after the given delay. */
export function FadeIn({ delay, className = '', as = 'div', ...props }) {
  const Tag = as
  return <Tag className={`fade-in ${className}`} style={delayStyle(delay)} {...props} />
}
