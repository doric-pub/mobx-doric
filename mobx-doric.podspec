Pod::Spec.new do |s|
    s.name             = 'mobx-doric'
    s.version          = '0.1.11'
    s.summary          = 'Doric extension library'
  
    s.description      = <<-DESC
    This library provides extension library to support using mobx in doric.
                            DESC

    s.homepage         = 'https://github.com/doric-pub/mobx-doric'
    s.license          = { :type => 'Apache-2.0', :file => 'LICENSE' }
    s.author           = { 'pengfei.zhou' => 'pengfeizhou@foxmail.com' }
    s.source           = { :git => 'https://github.com/doric-pub/mobx-doric.git', :tag => s.version.to_s }
  
    s.ios.deployment_target = '10.0'
  
    s.source_files = 'iOS/Classes/**/*'
    s.resource     =  "dist/**/*"
    s.public_header_files = 'iOS/Classes/**/*.h'
    s.dependency 'DoricCore'
end
