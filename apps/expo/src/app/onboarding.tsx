import { View, Text, Dimensions, Animated, StyleSheet, Pressable } from 'react-native'
import React, { useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Stack, useRouter } from 'expo-router'
import { SvgUri } from 'react-native-svg'

const DATA = [
    {
      "key": "3571572",
      "title": "Multi-lateral intermediate moratorium",
      "description": "I'll back up the multi-byte XSS matrix, that should feed the SCSI application!",
      "image": "https://res.cloudinary.com/dhciks96e/image/upload/v1684398772/undraw_transfer_money_re_6o1h_ddgpxn.svg"
    },
    {
      "key": "3571747",
      "title": "Automated radical data-warehouse",
      "description": "Use the optical SAS system, then you can navigate the auxiliary alarm!",
      "image": "https://res.cloudinary.com/dhciks96e/image/upload/v1684399133/undraw_online_banking_re_kwqh_v7zyku.svg"
    },
    {
      "key": "3571680",
      "title": "Inverse attitude-oriented system engine",
      "description": "The ADP array is down, compress the online sensor so we can input the HTTP panel!",
      "image": "https://res.cloudinary.com/dhciks96e/image/upload/v1684399254/undraw_investment_data_re_sh9x_c3k6kt.svg"
    },
    {
      "key": "3571603",
      "title": "Monitored global data-warehouse",
      "description": "We need to program the open-source IB interface!",
      "image": "https://res.cloudinary.com/dhciks96e/image/upload/v1684399339/undraw_mobile_pay_re_sjb8_ujccln.svg"
    }
  ]

  const bgs = [ '#818cf8', '#059669', '#34d399', '#4ade80',];
const Indicator= ({scrollX, width}: {scrollX: Animated.Value, width:number})=> {
   
  
return (
    <View className='flex flex-row absolute bottom-5 '>
        {DATA.map((_ ,i)=> {

const scale= scrollX.interpolate({
    inputRange: [(i-1)*width, i*width, (i+1)*width],
    outputRange:[0.8, 1.4, 0.8],
    extrapolate: 'clamp'
})
const opacity= scrollX.interpolate({
    inputRange: [(i-1)*width, i*width, (i+1)*width],
    outputRange:[0.6, 1, 0.6],
    extrapolate: 'clamp'
})
            return <Animated.View key={`indicator-${i}`} className='h-3 w-3 rounded-md bg-slate-50 m-3 ' 
            style={{
                opacity,
                transform: [
                    {
                        scale,
                      
                    }
                ]
            }}
            />

          
        })}
    </View>
)
}
const Backdrop = ({scrollX, width}: {scrollX: Animated.Value, width:number})=> {

    const backgroundColor= scrollX.interpolate({
        inputRange: bgs.map((_ , i)=> i*width),
        outputRange: bgs.map((bg)=> bg)
    })
    return (
<Animated.View
style={[
    StyleSheet.absoluteFillObject, 
{
    backgroundColor
},
]}
/>
    )
}

const Square =({scrollX, width, height}: {scrollX: Animated.Value, width:number, height:number})=> {
    const YOLO=Animated.modulo(Animated.divide(Animated.modulo(scrollX, width), new Animated.Value(width)), 1)
    const rotate=YOLO.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['35deg', '0deg', '35deg']
    })
    const translateX=YOLO.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -height,  -0]
    })
    return (
        <Animated.View 
        style= {{
            width:height,
            height:height,
            backgroundColor: "#fff",
            borderRadius:86,
            position: 'absolute',
           top: -height*.6,
           left:-height*0.3,
            transform : [
                {
                    rotate,
                   
                },
                {
                    translateX
                }
            ]
        }}
        />
    )
}
const Onboarding = () => {
    const dimentions=Dimensions.get('screen')
    const {width, height}=dimentions
    
      const scrollX=useRef(new Animated.Value(0)).current
  const router=useRouter()
  return (
    <View className='flex-1 bg-white flex justify-center items-center'>
        <StatusBar hidden/>
        <Stack.Screen options={{headerShown: false}} />
   
    <Backdrop scrollX={scrollX} width={width}/>
    <Square height={height} width={width} scrollX={scrollX}/>
    <Animated.FlatList 
    
    data={DATA}
    keyExtractor={item=>item.key}
    horizontal
    pagingEnabled
    scrollEventThrottle={32}
    contentContainerStyle={{paddingBottom:100}}
    onScroll={Animated.event([{nativeEvent: {contentOffset: {x:scrollX}}}], {useNativeDriver:false})}
    showsHorizontalScrollIndicator={false}
    renderItem={({item})=> {
        return (
          <View className='justify-center align-middle' style={{width}}>
      <View className='flex-[60%]  w-full  bg-inherit p-5 flex justify-center items-center'>
      <SvgUri
    width="70%"
    height="70%"
    uri={item.image}
  />
        </View>
        <View className=' flex-[30%] p-5 flex justify-start'>
            <Text className='text-2xl tracking-wide  font-semibold my-4 text-white mt-8'>
                {item.title}
            </Text>
            <Text className='tracking-wide text-white'>
                {item.description}
            </Text>
          

</View>  

            
             </View>  
        )
    }}
    />
     <View className='w-full flex flex-row justify-between absolute bottom-16 px-5'>

<Pressable 
android_ripple={{color:"#4ade80", radius:40}}
className='w-1/3 py-3 rounded-lg bg-slate-100 flex justify-center items-center' onPress={()=>router.push("/auth")}>
     <Text className='text-lg text-slate-700'>Login</Text>
 </Pressable>
 <Pressable
 android_ripple={{color:"#4ade80", radius:40}}
 className='w-1/3 py-3 rounded-lg bg-slate-100 flex justify-center items-center' onPress={()=>router.push("/auth")}>
     <Text className='text-lg text-slate-700 '>Sign up</Text>
 </Pressable>
</View>
    <Indicator scrollX={scrollX} width={width}/>
    </View>
  )
}

export default Onboarding