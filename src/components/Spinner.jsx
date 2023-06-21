import styles from './Spinner.module.css'

const Spinner = () => {
  return (
    <div className='bg-black bg-opacity-50 h-screen flex items-center justify-center z-50'>
        <div className='h-24'>
            <div className={styles.custom}></div>
        </div>
    </div>
  )
}

export default Spinner