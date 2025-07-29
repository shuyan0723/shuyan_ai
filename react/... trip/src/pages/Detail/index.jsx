import {
    useParams,
} from 'react-router-dom'
import {
    Skeleton
} from 'react-vant'
import {
    memo,
    useEffect
} from 'react'
import useDetailStore from '@/store/useDetailStore'
import useTitle from '@/hooks/useTitle'
import styles from './detail.module.css'
import {
    ArrowLeft,
    Cart,
    ServiceO,
    StarO,
    ShopO,
    Logistics,
    LikeO,
    Description
} from '@react-vant/icons'
import {
    Swiper,
    Image
} from 'react-vant';
const BottomBar=memo(()=>{
    return(
        <div className={styles.bottomBar}>
            <div className={styles.left}>
               <div className={styles.iconBlock}>
                <ShopO />
                <span>店铺</span>
               </div>
               <div className={styles.iconBlock}>
                <ServiceO />
                <span>客服</span>
               </div>
                <div className={styles.iconBlock}>
                <StarO />
                <span>收藏</span>
               </div>
            </div>
             <div className={styles.right}>
                 <div className={styles.cartBtn}>加入购物车</div>
                 <div className={styles.cartBtn}>立即购买</div>
            </div>

        </div>
    )
})
const Detail = () => {
    const {id} = useParams();
    const { loading, detail, setDetail } = useDetailStore();
    useEffect(() => {
        setDetail()
    }, [])
    // ✅ 正确位置：组件顶层作用域
    useTitle(detail?.title || '默认标题');
    if (loading) return <Skeleton />
    return (
        <>
        <nav className={styles.nav}>
            <ArrowLeft fontSize={36} />
            <Cart fontSize={36} />
        </nav>
        {/* 幻灯片 */}
        <div className={styles.container}>
            <Swiper>
                {
                    (detail?.images || []).length > 0 ? (
                        (detail.images).map((item,index)=>(
                            <Swiper.Item key={index}>
                                <Image lazyload src={item.url} />
                            </Swiper.Item>
                        ))
                    ) : (
                        // 当没有图片时显示默认占位内容
                        <Swiper.Item>
                            <div className={styles.emptySlide}>暂无图片</div>
                        </Swiper.Item>
                    )
                }
            </Swiper>
           <div className={styles.priceRow}>
                <div className={styles.price}>￥{detail?.price || '加载中...'}</div> // ✅ 添加可选链和默认值
                <div className={styles.couponBtn}>登录查看更多</div>
            </div> 
            <div className={styles.titleRow}>
                <span className={styles.tag}>IFASHION</span>
                <span className={styles.title}>{detail?.title}</span>
            </div>
            <div className={styles.deliveryRow}>
                <Logistics className={styles.icon} fontSize={30}/>
                <span className={styles.deliveryText}>
                预计3小时内发货 | 承诺48小时内发货
                </span>
                <br/>
                <span className={styles.extraInfo}>河北保定 · 快递 · 免运费</span>
            </div>
            
            <div className={styles.row}>
                <LikeO className={styles.icon} />
                <span>7天无理由退货</span>
            </div>
            <div className={styles.row}>
                <Description className={styles.icon} />
                <span>风格 肩带是否可拆卸 是否带锁 有无夹层</span>
           </div>
        
        </div>
        <BottomBar />
        </>
    )
}


export default Detail