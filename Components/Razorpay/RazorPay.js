import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { WebView } from 'react-native-webview';

const RazorPay = () => {
  const [showWebView, setShowWebView] = useState(false);

  const openWebView = () => {
    setShowWebView(true);
  };

  const closeWebView = () => {
    setShowWebView(false);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center',top:100 }}>
      {!showWebView ? (
        <Button title="Open WebView" onPress={openWebView} />
      ) : (
        <View style={{flex:1,width:'100%'}}>
          <WebView
            source={{ uri: 'http://18.118.90.192/razorpay_index?tkn=$2y$10$aVSAWV7Hj69/uwGAnJIzvu7HqzjTS2MrlwPPI7acZeRRWLuofag2.&amount=1000' }} // Replace with your URL
            style={{ flex: 1 }}
            javaScriptCanOpenWindowsAutomatically
            
          />
        </View>
      )}
    </View>
  );
};

export default RazorPay;
