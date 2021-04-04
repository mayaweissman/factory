import React, { Component } from "react";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./product-pop-up.css";
import { ProductModel } from "../../models/productModel";
import CloseIcon from "@material-ui/icons/Close";
import { ProductsType } from "../../models/productsTypeModel";
import { getProductsTypes } from "../../data/products-types";
import { CampaignModel } from "../../models/campaignModel";
import ProgressBar from "@ramonak/react-progress-bar";
import axios from "axios";
import { ImagesModel } from "../../models/imagesModel";
import { Config } from "../../config";
import ScrollContainer from "react-indiana-drag-scroll";
import SimpleImageSlider from "react-simple-image-slider";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import IconButton from '@material-ui/core/IconButton';

interface ProductPopUpProps {
  product: ProductModel;
  campaign: CampaignModel;
}

interface ProductPopUpState {
  images: ImagesModel;
  productsType: ProductsType;
  isOnSlider: boolean;
  isVideo: boolean;
  isOnMobile: boolean;
  isScroliing: boolean;
  isVideosCarrousle: boolean;
}

export class ProductPopUp extends Component<
  ProductPopUpProps,
  ProductPopUpState
> {
  private LeftAreaRef = React.createRef<HTMLDivElement>();
  private sliderRef = React.createRef<any>();

  public constructor(props: ProductPopUpProps) {
    super(props);
    this.state = {
      images: new ImagesModel(),
      productsType: new ProductsType(),
      isOnSlider: false,
      isVideo: false,
      isOnMobile: false,
      isScroliing: false,
      isVideosCarrousle: false,
    };
  }

  public closePopUp = () => {
    store.dispatch({ type: ActionType.changeDisplayForProductsPopUp });
  };

  public stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  public async componentDidMount() {
    try {
      const bodyClass = document.body.classList[0];
      if (bodyClass === "mobile") {
        this.setState({ isOnMobile: true });
      }

      if (!this.props.product) {
        this.closePopUp();
      }
      if (this.props.product.productTypeId === 857 || this.props.product.productTypeId === 402) {
        this.setState({ isOnSlider: true });
      }
      let productImages = this.props.product.images as ImagesModel;
      this.setState({ images: productImages });

      if (productImages.is_video) {
        const images = { img1: "", img2: "", img3: "" };
        this.setState({ images });
        this.setState({ isVideosCarrousle: true });
        for (const video of Object.values(productImages)) {
          if (video) {
            const script = document.createElement("script");
            script.src = video;
            script.async = true;
            this.LeftAreaRef.current!.appendChild(script);
          }
        }
      } else {
        if (productImages.img2?.includes("https://live.sekindo.com")) {
          const script = document.createElement("script");
          script.src = productImages.img2;
          script.async = true;
          this.LeftAreaRef.current!.appendChild(script);
          const images = { img1: "", img2: "", img3: "" };
          this.setState({ images });
          this.setState({ isVideo: true });
        }
      }

      const response = await axios.get(
        Config.serverUrl + "/all-products-types/"
      );
      const productsTypes: ProductsType[] = response.data.productsTypes;
      const productTypes = productsTypes.find(
        (t) => t.productsTypeId === this.props.product.productTypeId
      );
      this.setState({ productsType: productTypes as ProductsType });

      const areaWidth = this.sliderRef.current?.container?.current?.clientWidth;
      const scrollWidth = this.sliderRef.current?.container?.current
        ?.scrollWidth;

      if (scrollWidth > areaWidth) {
        this.setState({ isScroliing: true });
        this.sliderRef.current?.container.current.scrollTo({
          left: 100,
          behavior: "smooth"
        })
      }

    } catch (err) {
      console.log(err.message);
    }
  }

  public scrollToLeft = () => {
    let left = this.sliderRef.current?.container.current.scrollLeft;
    this.sliderRef.current?.container.current.scrollTo({
      left: left -= 20,
      behavior: "smooth"
    })
  }

  public scrollToRight = () => {
    let left = this.sliderRef.current?.container.current.scrollLeft;
    this.sliderRef.current?.container.current.scrollTo({
      left: left += 20,
      behavior: "smooth"
    })
  }

  public render() {
    return (
      <div
        className={
          this.state.isVideosCarrousle
            ? "full-screen-product-conatiner videos"
            : "full-screen-product-conatiner"
        }
        onClick={this.closePopUp}
      >
        <div
          className={
            this.state.isOnMobile && this.state.isVideo
              ? "small-product-video-conatiner"
              : "small-product-conatiner"
          }
          onClick={this.stopPropagation}
        >
          <div
            ref={this.LeftAreaRef}
            className={
              this.state.isOnSlider ? "left-area carrousle-area" : "left-area"
            }
          >
            {!this.state.isOnSlider && (
              <>
                <img
                  className="product-img product-img1"
                  src={this.state.images.img1}
                />
                <img
                  className="product-img product-img2"
                  src={this.state.images.img2}
                />
                <img
                  className="product-img product-img3"
                  src={this.state.images.img3}
                />
                <img
                  className="product-img product-img4"
                  src={this.state.images.img4}
                />
              </>
            )}
            {this.state.isScroliing && <div style={{height: this.sliderRef.current?.container.current.clientHeight,
               top: (606 - this.sliderRef.current?.container.current.clientHeight) / 2}} className="scrolling-left"></div>}
            {this.state.isOnSlider && (
              <ScrollContainer className="carouslle" ref={this.sliderRef}>
                {this.state.images.img1 && (
                  <img className="carouslle-img" src={this.state.images.img1} />
                )}
                {this.state.images.img2 && (
                  <img className="carouslle-img" src={this.state.images.img2} />
                )}
                {this.state.images.img3 && (
                  <img className="carouslle-img" src={this.state.images.img3} />
                )}
                {this.state.images.img4 && (
                  <img className="carouslle-img" src={this.state.images.img4} />
                )}
                {this.state.images.img5 && (
                  <img className="carouslle-img" src={this.state.images.img5} />
                )}
                {this.state.images.img6 && (
                  <img className="carouslle-img" src={this.state.images.img6} />
                )}
                {this.state.images.img7 && (
                  <img className="carouslle-img" src={this.state.images.img7} />
                )}
              </ScrollContainer>
            )}
            {this.state.isOnSlider && this.state.isVideosCarrousle && (
              <ScrollContainer
                className="carouslle"
                ref={this.sliderRef}
              ></ScrollContainer>
            )}
            {this.state.isScroliing && <div style={{height: this.sliderRef.current?.container.current.clientHeight,
            top: (606 - this.sliderRef.current?.container.current.clientHeight) / 2}} className="scrolling-right"></div>}
          </div>

          <script
            type="text/javascript"
            src="https://live.sekindo.com/live/liveView.php?s=102802&cbuster=%%CACHEBUSTER%%&pubUrl=%%REFERRER_URL_ESC%%&subId=[SUBID_ENCODED]&x=%%WIDTH%%&y=%%HEIGHT%%&vp_content=embed138cf7ohjskq"
          ></script>
          <div className="right-area">
            <div className="titlesInRightArea">
              <div className="right-in-titles">
                <div className="product-rate">
                  {this.props.product?.successRates} %
                </div>
              </div>
              <div className="left-in-titles">
                <h1 className="type-title">
                  {this.props.product.productId &&
                    this.state.productsType.nameForSingle}
                </h1>
                <p className="campaign-name-area">
                  {this.props.campaign?.campaignName}
                </p>
              </div>
            </div>

            <div className="bars-area">
              <p className="bar-title">Best practice media</p>
              <p className="bar-rate">65 %</p>
              <ProgressBar
                height="7px"
                borderRadius="0"
                bgcolor="#FFDB48"
                completed={65}
              />
            </div>

            <div className="bars-area">
              <p className="bar-title">Best practice media</p>
              <p className="bar-rate">95 %</p>
              <ProgressBar
                height="7px"
                borderRadius="0"
                bgcolor="#1CE5A2"
                completed={95}
              />
            </div>

            <div className="bars-area">
              <p className="bar-title">Best practice media</p>
              <p className="bar-rate">40 %</p>
              <ProgressBar
                height="7px"
                borderRadius="0"
                bgcolor="#E4002B"
                completed={40}
              />
            </div>
          </div>
          <button
            className="close-product-pop-up-btn"
            onClick={this.closePopUp}
          >
            <CloseIcon />
          </button>
{/* 
          {this.state.isScroliing &&
            <div className="arrows-bottom">
              <IconButton onClick={this.scrollToLeft}>
                <ArrowLeftIcon style={{fontSize: '8px' , marginRight: '7px'}}/>
              </IconButton>
              <IconButton onClick={this.scrollToRight}>
                <ArrowRightIcon style={{fontSize: '8px', marginLeft: '7px'}}/>
              </IconButton>

            </div>} */}
        </div>
      </div>
    );
  }
}
